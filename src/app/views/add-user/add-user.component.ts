import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor, NgForOf } from '@angular/common';

import { GeneralInfoFormComponent } from './components/general-info-form/general-info-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { City, Country } from 'src/app/models';

@Component({
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, GeneralInfoFormComponent, CommonModule, AddressFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AddUserComponent {
  public addUserForm!: FormGroup;

  countriesMock: Country[] = [
    { name: 'Poland', id: 1 },
    { name: 'Germany', id: 2 },
    { name: 'France', id: 3 },
  ];

  citiesMock: City[] = [
    { name: 'Warsaw', id: 1, countryId: 1 },
    { name: 'Berlin', id: 2, countryId: 2 },
    { name: 'Paris', id: 3, countryId: 3 },
    { name: 'Krakow', id: 4, countryId: 1 },
    { name: 'Gdansk', id: 5, countryId: 1 },
    { name: 'Wroclaw', id: 6, countryId: 1 },
    { name: 'Hamburg', id: 7, countryId: 2 },
    { name: 'Munich', id: 8, countryId: 2 },
    { name: 'Cologne', id: 9, countryId: 2 },
    { name: 'Lyon', id: 10, countryId: 3 },
    { name: 'Marseille', id: 11, countryId: 3 },
    { name: 'Toulouse', id: 12, countryId: 3 }
  ];

  constructor() {
    this.generateUserForm();
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
