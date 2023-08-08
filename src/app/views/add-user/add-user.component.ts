import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, of, takeUntil, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, NgFor } from '@angular/common';

import { GeneralInfoFormComponent, AddressFormComponent } from './components';
import { Country, Person } from '../../models';
import { ApiService, NotificationService } from '../../services';

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

  public addUserForm!: FormGroup;
  public countries$: Observable<Country[]> = of([]);

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    public readonly notificationService: NotificationService
  ) {
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
    .pipe(
      tap(() => {
        this.addUserForm.reset();
        this.router.navigate(['/persons']);
      }),
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  public addAddress(): void {
    this.addressesFormArray.push(AddressFormComponent.addUserAddress());
  }

  public removeAddress(index: number): void {
    this.addressesFormArray.removeAt(index);
  }
}
