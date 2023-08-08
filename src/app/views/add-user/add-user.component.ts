import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';

import { GeneralInfoFormComponent } from './components/general-info-form/general-info-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { City, Country, Person } from '../../models';
import { ApiService } from '../../services/api.service';
import { Observable, Subject, of, takeUntil } from 'rxjs';

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
export class AddUserComponent implements OnInit, OnDestroy {
  private readonly _destroyed$: Subject<void> = new Subject<void>();
  private readonly _newCityNotifyer$: Subject<City> = new Subject<City>();

  public newCityNotifyer$: Observable<City> = this._newCityNotifyer$.asObservable();
  public addUserForm!: FormGroup;
  public countries$: Observable<Country[]> = of([]);

  constructor(private readonly apiService: ApiService) {
    this.generateUserForm();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnInit(): void {
    this.readCountries();
  }

  get generalInfoFormGroups(): FormGroup {
    return this.addUserForm.get('generalInfo') as FormGroup;
  }

  get addressesFormArray(): FormArray {
    return this.addUserForm.get('addresses') as FormArray;
  }

  private readCountries(): void {
    this.countries$ = this.apiService.getCountries();
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
    const { generalInfo: { name, birthdate }, addresses } = this.addUserForm.value;
    const person: Person = {
      id: this.apiService.generateUUID(),
      name,
      birthdate,
      addresses
    };
    
    this.apiService.addPerson(person)
    .pipe(takeUntil(this._destroyed$))
    .subscribe();
  }

  public addAddress(): void {
    this.addressesFormArray.push(AddressFormComponent.addUserAddress());
  }

  public removeAddress(index: number): void {
    this.addressesFormArray.removeAt(index);
  }

  public notifyCityAdded(city: City): void {
    this._newCityNotifyer$.next(city);
  }

  // method that creates a new uuid
  
}
