import { TestBed } from '@angular/core/testing';

import { ErrorsService } from './errors.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';

describe('ErrorsService', () => {
  let service: ErrorsService;
  let error: HttpErrorResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error', () => {
    error = new HttpErrorResponse({});
    service.handleHTTPErrors(error).subscribe({
      error: () => throwError(() => error),
    });
    expect(service.handleHTTPErrors).toThrowError;
    /**/
  });

  it('handle error 400', () => {
    error = new HttpErrorResponse({ status: 400 });
    const result = service.handleAPIErrors(error);
    expect(result).toBe('Invalid request, please try again');
  });

  it('handle error 401', () => {
    error = new HttpErrorResponse({ status: 401 });
    const result = service.handleAPIErrors(error);
    expect(result).toBe(
      'Authorization failed. Please contact the master to resolve the problem'
    );
  });

  it('handle error 404', () => {
    error = new HttpErrorResponse({
      status: 404,
      error: { type: '' },
    });
    const result = service.handleAPIErrors(error);
    expect(result).toBe('The requested resource could not be found');
  });

  it('handle error 404 with type', () => {
    error = new HttpErrorResponse({
      status: 404,
      error: { type: 'calculation_unsuccessful' },
    });
    const result = service.handleAPIErrors(error);
    expect(result).toBe(
      'There was a problem on calculate the footprint for this kind of resources. Please try again'
    );
  });

  it('handle error default', () => {
    error = new HttpErrorResponse({});
    const result = service.handleAPIErrors(error);
    expect(result).toBe('Please reload the app and try again');
  });
});
