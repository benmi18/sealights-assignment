import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { City } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _newCityNotifyer$: Subject<City> = new Subject<City>();

  public newCityNotifyer$: Observable<City> = this._newCityNotifyer$.asObservable();

  public notifyNewCityAdded(city: City): void {
    this._newCityNotifyer$.next(city);
  }
}
