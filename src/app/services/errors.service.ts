import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  constructor() {}

  handleHTTPErrors(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  handleAPIErrors(error: HttpErrorResponse) {
    console.error(error.error);
    if (error.status === 400) {
      return 'Invalid request, please try again';
    } else if (error.status === 401) {
      return 'Authorization failed. Please contact the master to resolve the problem';
    } else if (
      error.status === 404 &&
      error.error.type !== 'calculation_unsuccessful'
    ) {
      return 'The requested resource could not be found';
    } else if (
      error.status === 404 &&
      error.error.type === 'calculation_unsuccessful'
    ) {
      return 'There was a problem on calculate the footprint for this kind of resources. Please try again';
    }
    return 'Please reload the app and try again';
  }
}
