import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, filter, of, switchMap, takeUntil, tap } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AddCityDialogComponent } from '../../components';
import { ApiService, NotificationService } from './../../../../services';
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
export class AddressFormComponent implements OnInit, OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject<void>();

  @Input() childForm!: any;
  @Input() addressIndex!: number;
  @Input() addressCount!: number;
  @Input() countries!: Country[] | null;

  @Output() onRemoveAddress: EventEmitter<number> = new EventEmitter<number>();

  public selectedCountry: Country | undefined;
  public cities$: Observable<City[]> = of([]);

  constructor(
    public readonly dialog: MatDialog,
    private readonly apiService: ApiService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnInit(): void {
    this.listenToCountryChange();
    this.handleNewCityNotification();
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
    this.childForm.get('country').valueChanges.pipe(
      tap(console.log),
      filter((countryId: number) => !!countryId),
      tap((countryId: number) => {
        const country = this.countries?.find((country: Country) => country.id === countryId);

        this.selectedCountry = country;

        this.cities$ = this.apiService.getCities(countryId);
      }),
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  private handleNewCityNotification(): void {
    this.notificationService.newCityNotifyer$
      .pipe(
        tap((city: City) => {
          if (city.countryId === this.selectedCountry?.id) {
            this.cities$ = this.apiService.getCities(city.countryId);
          }
        }),
        takeUntil(this._destroyed$)
      ).subscribe();
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
        tap(() => this.notificationService.notifyNewCityAdded(newCity)),
        takeUntil(this._destroyed$)
      ).subscribe();
  }

  public removeAddress(): void {
    this.onRemoveAddress.next(this.addressIndex);
  }
}
