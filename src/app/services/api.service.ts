import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { City, Country, Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private readonly httpClient: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(`${this.API_URL}/persons`);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.API_URL}/countries`);
  }

  getCities(countryId: number): Observable<City[]> {
    return this.httpClient.get<City[]>(`${this.API_URL}/cities/${countryId}`);
  }

  addPerson(person: Person): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/persons`, person);
  }

  addCity(city: City): Observable<void> {
    return this.httpClient.post<void>(`${this.API_URL}/cities`, city);
  }
}
