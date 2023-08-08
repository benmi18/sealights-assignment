import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';

import { GeneralInfoFormComponent } from './components/general-info-form/general-info-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { City, Country } from '../../models';
import { ApiService } from '../../services/api.service';
import { Observable, of } from 'rxjs';

@Component({
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    GeneralInfoFormComponent,
    NgFor,
    AsyncPipe,
    AddressFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AddUserComponent implements OnInit {
  public addUserForm!: FormGroup;
  public cities$: Observable<City[]> = of([]);
  public countries$: Observable<Country[]> = of([]);

  constructor(private readonly apiService: ApiService) {
    this.generateUserForm();
  }

  ngOnInit(): void {
    this.readCountries();
  }

  readCities(country: Country): void {
    this.cities$ = this.apiService.getCities(country.id);
  }

  readCountries(): void {
    this.countries$ = this.apiService.getCountries();
  }

  get generalInfoFormGroups(): FormGroup {
    return this.addUserForm.get('generalInfo') as FormGroup;
  }

  get addressesFormArray(): FormArray {
    return this.addUserForm.get('addresses') as FormArray;
  }

  private generateUserForm(): void {
    this.addUserForm = new FormGroup({
      generalInfo: new FormGroup({
        name: new FormControl('', { validators: [Validators.required] }),
        birthdate: new FormControl(''),
      }),
      addresses: new FormArray([AddressFormComponent.addUserAddress()])
    });
  }

  public submitForm(): void {
    console.log(this.addUserForm.value);
  }

  public addAddress(): void {
    this.addressesFormArray.push(AddressFormComponent.addUserAddress());
  }

  public removeAddress(index: number): void {
    this.addressesFormArray.removeAt(index);
  }
}
