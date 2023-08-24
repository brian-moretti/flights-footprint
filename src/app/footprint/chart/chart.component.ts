import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  constructor(private chartService: ChartService) {}

  @ViewChild('chart') chart!: UIChart;

  ngOnInit(): void {
    this.chartNG();
    this.update();
  }

  update() {
    this.chartService.footprintData$.subscribe((data) => {
      this.addDataInChart(data.singlePassenger, data.totalPassengers);
    });
  }

  data: any;
  options: any;

  chartNG() {
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'Footprint for 1 passenger',
          backgroundColor: '#ff9f1c',
          borderColor: '#ff9f1c',
          borderWidth: 2,
          data: [],
          yAxisID: 'y',
          barPercentage: 0.5,
        },
        {
          label: 'Footprint total',
          backgroundColor: '#0081af',
          borderColor: '#0081af',
          borderWidth: 2,
          data: [],
          yAxisID: 'y1',
          barPercentage: 0.25,
        },
      ],
    };

    this.options = {
      scales: {
        x: {
          title: {
            color: '#00abe7',
            display: true,
            text: 'Flights Comparison',
          },
        },
        y: {
          title: {
            color: '#ff9f1c',
            display: true,
            text: 'Tons x CO2e x 1 passenger',
          },
          position: 'left',
          grid: {
            display: false,
          },
          ticks: { color: '#ff9f1c', font: { weight: 600 } },
          suggestMin: 0,
          min: 0,
          suggestMax: 10,
          max: 20,
        },
        y1: {
          title: {
            color: '#0081af',
            display: true,
            text: 'Tons x CO2e x passengers',
          },
          grid: {
            display: false,
          },
          position: 'right',
          ticks: { color: '#0081af', font: { weight: 600 } },
        },
      },
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: { color: '#00abe7' },
        },
      },
    };
  }
  addDataInChart(footprintSingle: number, footprintTotal: number) {
    let array = this.data.datasets;

    array[0].data.push(footprintSingle);
    array[1].data.push(footprintTotal);
    if (array[0].data.length > 6 && array[1].data.length > 6) {
      array[0].data.shift();
      array[1].data.shift();
    }

    this.addLabelsInChart();
    if (this.chart) {
      this.chart.reinit();
    }
  }

  currentIDComparison: number = 1;

  addLabelsInChart() {
    let array = this.data.labels;
    let maxLabels = 6;
    let label = `${this.currentIDComparison}° Flight`;

    array.push(label);
    this.currentIDComparison = (this.currentIDComparison % 6) + 1;

    if (array.length >= maxLabels) {
      this.currentIDComparison = 6;
      array.length = 6;
    }
  }
}
