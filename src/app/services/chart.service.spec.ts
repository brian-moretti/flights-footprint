import { TestBed } from '@angular/core/testing';

import { ChartService } from './chart.service';

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('correctly update data', () => {
    let fakeData = { singlePassenger: 0, totalPassengers: 0 };
    service.updateData(fakeData);
    service.footprintData$.subscribe((data) => {
      expect(data.singlePassenger).toEqual(fakeData.singlePassenger);
      expect(data.totalPassengers).toEqual(fakeData.totalPassengers);
    });
  });
});
