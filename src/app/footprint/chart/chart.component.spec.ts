import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { ChartModule } from 'primeng/chart';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChartModule],
      declarations: [ChartComponent],
    });
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add labels to array', () => {
    let maxLabels = 6;
    for (let i = 0; i < maxLabels + 2; i++) {
      component.addLabelsInChart();
    }
    expect(component.data.labels.length).toBe(maxLabels);

    for (let i = 0; i < maxLabels; i++) {
      expect(component.data.labels[i]).toBe(`${i + 1}° Flight`);
    }
  });

  it('should keep currentID to 6', () => {
    const maxLabels = 6;
    for (let i = 0; i < maxLabels + 2; i++) {
      component.addLabelsInChart();
    }
    expect(component.currentIDComparison).toBe(6);
  });

  it('should push new data', () => {
    let initialLength = component.data.datasets[0].data.length;
    const singlePassenger = 0;
    const totalPassenger = 0;
    component.addDataInChart(singlePassenger, totalPassenger);
    expect(component.data.datasets[0].data).toContain(singlePassenger);
    expect(component.data.datasets[1].data).toContain(totalPassenger);
  });

  it('should remove the first index if data.length > 6', () => {
    const array = component.data.datasets;
    array[0].data = [1, 2, 3, 4, 5, 6];
    array[1].data = [10, 20, 30, 40, 50, 60];
    const singlePassenger = 0;
    const totalPassenger = 0;
    component.addDataInChart(singlePassenger, totalPassenger);
    expect(array[0].data).toEqual([2, 3, 4, 5, 6, 0]);
    expect(array[1].data).toEqual([20, 30, 40, 50, 60, 0]);
  });
});
