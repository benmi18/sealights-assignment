import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../../services/api.service';
import { Person } from '../../models';

@Component({
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    AsyncPipe,
    NgIf,
    DatePipe
  ]
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'birthdate', 'addressCount'];

  public persons$: Observable<Person[]> | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.readPersons();
  }

  private readPersons(): void {
    this.persons$ = this.apiService.getPersons();
  }

  public addPerson(): void {
    this.router.navigate(['add-person']);
  }
}
