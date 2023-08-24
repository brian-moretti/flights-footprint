import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment as env } from 'src/environments/environment.development';
import { Footprint } from '../model/airports.model';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class FootprintService {
  constructor(private http: HttpClient, private handleError: ErrorsService) {}

  url = 'https://api.goclimate.com/v1/flight_footprint';
  code = btoa(env.APIKey);
  header = new HttpHeaders({
    Authorization: `Basic ${this.code}`,
    'Content-Type': 'application/json',
  });

  getFootprintData(
    origin: string,
    destination: string,
    cabin_class: string
  ): Observable<Footprint> {
    const params = new HttpParams({
      fromObject: {
        'segments[0][origin]': origin,
        'segments[0][destination]': destination,
        'segments[1][origin]': destination,
        'segments[1][destination]': origin,
        cabin_class: cabin_class,
        currencies: 'EUR',
      },
    });
    return this.http
      .get<Footprint>(this.url, {
        headers: this.header,
        params: params,
      })
      .pipe(catchError(this.handleError.handleHTTPErrors));
  }
}

//if TZ in model inludes {continent name} - change currency in API
