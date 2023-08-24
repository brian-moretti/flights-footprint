import { TestBed } from '@angular/core/testing';

import { FootprintService } from './footprint.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Footprint } from '../model/airports.model';
import { HttpParams } from '@angular/common/http';

describe('FootprintService', () => {
  let service: FootprintService;
  let fakeFootprint: Footprint;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FootprintService],
    });
    service = TestBed.inject(FootprintService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get footprint data', () => {
    const origin = 'JFK';
    const destination = 'LHR';
    const cabinClass = 'Economy';

    const mockFootprint: Footprint = {
      footprint: 0,
      offset_prices: [
        {
          amount: 0,
          currency: '',
          offset_url: '',
          locale: '',
        },
      ],
    };

    service
      .getFootprintData(origin, destination, cabinClass)
      .subscribe((data) => {
        expect(data).toEqual(mockFootprint); // Check if response data matches mock data
      });

    const req = controller.expectOne(
      (request) =>
        request.url === service.url &&
        request.method === 'GET' &&
        request.params.has('segments[0][origin]') &&
        request.params.has('segments[0][destination]') &&
        request.params.has('segments[1][destination]') &&
        request.params.has('segments[1][origin]') &&
        request.params.has('cabin_class') &&
        request.params.has('currencies')
    );

    req.flush(mockFootprint); // Respond with mock data
  });
});
