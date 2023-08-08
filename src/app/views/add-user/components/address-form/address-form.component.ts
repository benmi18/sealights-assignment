import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, filter, of, switchMap, takeUntil, tap } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';
import { ApiService } from './../../../../services/api.service';
import { City, Country } from './../../../../models';


@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrls: ['./address-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    NgFor,
    NgIf,
    AsyncPipe
  ]
})
export class AddressFormComponent implements OnInit, OnChanges, OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject<void>();

  @Input() childForm!: any;
  @Input() addressIndex!: number;
  @Input() addressCount!: number;
  @Input() countries!: Country[] | null;
  @Input() newCityNotification: City | null = null;

  @Output() onRemoveAddress: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCityAdd: EventEmitter<City> = new EventEmitter<City>();

  public selectedCountry: Country | undefined;
  public cities$: Observable<City[]> = of([]);

  constructor(
    public readonly dialog: MatDialog,
    private readonly apiService: ApiService
  ) {}

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleNewCityNotification(changes['newCityNotification']?.currentValue);
  }

  ngOnInit(): void {
    this.listenToCountryChange();
  }

  static addUserAddress(): FormGroup {
    return new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      country: new FormControl(0),
      city: new FormControl(0),
      street: new FormControl('', { validators: [Validators.required] })
    });
  }

  private listenToCountryChange(): void {
    this.cities$ = this.childForm?.get('country')?.valueChanges.pipe(
      filter((countryId: number) => !!countryId),
      switchMap((countryId: number) => {
        const country = this.countries?.find((country: Country) => country.id === countryId);

        this.selectedCountry = country;

        return this.apiService.getCities(countryId);
      })
    );
  }

  private handleNewCityNotification(city: City): void {
    if (city && city.countryId === this.selectedCountry?.id) {
      this.cities$ = this.apiService.getCities(city.countryId);
    }
  }

  public openAddCityDialog(): void {
    let newCity: City = {
      id: this.apiService.generateUUID(),
      name: '',
      countryId: this.selectedCountry!.id
    };

    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      data: { country: this.selectedCountry, city: newCity }
    });

    dialogRef.afterClosed()
    .pipe(
      filter((city: City) => !!city),
      switchMap((city: City) => {
        newCity = city;

        return this.apiService.addCity(city)
      }),
      tap(() => this.onCityAdd.next(newCity)),
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  public removeAddress(): void {
    this.onRemoveAddress.next(this.addressIndex);
  }
}
