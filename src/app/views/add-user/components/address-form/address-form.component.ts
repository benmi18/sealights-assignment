import { AsyncPipe, NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';
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
    AsyncPipe
  ]
})
export class AddressFormComponent {
  @Input() childForm!: any;
  @Input() addressIndex!: number;
  @Input() countries!: Country[] | null;
  @Input() cities!: City[] | null;
  @Input() addressCount!: number;

  @Output() onRemoveAddress: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCountryChange: EventEmitter<Country> = new EventEmitter<Country>();
  @Output() onAddCity: EventEmitter<City> = new EventEmitter<City>();

  private selectedCountry: Country | undefined;

  constructor(public dialog: MatDialog) {
    this.listenToCountryChange();
  }

  static addUserAddress(): FormGroup {
    return new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      country: new FormControl(null),
      city: new FormControl(null),
      street: new FormControl('', { validators: [Validators.required] })
    });
  }

  private listenToCountryChange(): void {
    this.childForm?.get('country')?.valueChanges.pipe(
      tap((countryId: number) => {
        const country = this.countries?.find((country: Country) => country.id === countryId);

        this.selectedCountry = country;
        this.onCountryChange.next(country!);
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  public openAddCityDialog(): void {
    if (!this.selectedCountry) {
      console.error('No country selected');
      return;
    }

    const newCity = {
      id: (this.cities?.length || 0) + 1,
      name: '',
      countryId: this.selectedCountry!.id
    };

    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      data: { country: this.selectedCountry, city: newCity },
    });

    dialogRef.afterClosed().subscribe((city: City) => {
      if (!!city) {
        this.onAddCity.next(city);
      }
    });
  }

  public removeAddress(): void {
    this.onRemoveAddress.next(this.addressIndex);
  }
}
