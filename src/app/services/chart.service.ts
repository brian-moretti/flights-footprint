import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private _footprintData = new BehaviorSubject<{
    singlePassenger: number;
    totalPassengers: number;
  }>({
    singlePassenger: 0,
    totalPassengers: 0,
  });

  footprintData$ = this._footprintData.asObservable(); //sola lettura

  updateData(data: { singlePassenger: number; totalPassengers: number }) {
    this._footprintData.next(data); //!footprintData viene aggiornato con il valore DATA fornito da Footprint component
  }
}
