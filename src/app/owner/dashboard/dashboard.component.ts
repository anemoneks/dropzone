import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as mm from 'moment-timezone';
import { IPayment } from './../../interfaces/i-payment';
import { IChartData } from './../../interfaces/i-chart-data';
import { HttpClientHouseService } from './../../services/http-client-house.service';
import { HttpClientDashboardService } from './../../services/http-client-dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
declare var require: any;

@Component({
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements AfterViewInit, OnInit {
  subtitle: string;
  payments: IPayment[] = [];
  chart: any;
  public dashboard: any;

  constructor(
    private HttpClientHouseService: HttpClientHouseService,
    private HttpClientDashboardService: HttpClientDashboardService,
  ) {
    this.subtitle = 'This is some text within a card block.';
  }

  private MONTHS = () => {
    const months = [];
    const dateStart = moment();
    const dateEnd = moment().add(12, 'month');
    while (dateEnd.diff(dateStart, 'months') >= 0) {
      months.push(dateStart.format('M'))
      dateStart.add(1, 'month')
    }
    return months
  }

  // lineChart
  public lineChartLabels: Array<any> = Array.from(new Array(12), (x, i) => i)
    .reverse().map(x => {
      const today = new Date();
      return moment(new Date(today.setMonth(today.getMonth() - x))).format("MMM YY");
    }) || [];

  public lineChartOptions: any = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit(): void {

    forkJoin([this.HttpClientDashboardService.getDashboard()])
      .subscribe(results => {
        console.log(results[0]);
        this.dashboard = results[0];
      })

    this.HttpClientHouseService.getHouses()
      .subscribe(houses => {

        const payments = [].concat.apply([], (houses.map(h => h.payments) || []));
        const grouped = payments.reduce((r, a) => {
          const month = mm(a.paidDate).tz('Asia/Singapore').format('MMYY');
          r[month] = [...r[month] || [], a];
          return r;
        }, {});

        const list: Array<any> = Array.from(new Array(12), (x, i) => i).reverse().map(x => {
          const today = new Date();
          const label = moment(new Date(today.setMonth(today.getMonth() - x))).format("MMYY");

          if (grouped[label] == null)
            return 0;

          return (grouped[label] || [])
            .map(p => p.amount || 0)
            .reduce((a, b) => a + b, 0) || 0;
        }) || [];

        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: this.lineChartLabels,
            datasets: [
              {
                label: "Africa",
                data: list,
                borderColor: list.map((x, i) => {
                  return ['#FBCEB1', '#7FFFD4', '#4B5320', '#3B444B', '#E9D66B', '#B2BEB5', '#87A96B', '#FF9966', '#6D351A', '#007FFF', '#89CFF0', '#A1CAF1'][i % 12];
                }) || [],
                fill: false,
                backgroundColor: list.map((x, i) => {
                  return ['#FBCEB1', '#7FFFD4', '#4B5320', '#3B444B', '#E9D66B', '#B2BEB5', '#87A96B', '#FF9966', '#6D351A', '#007FFF', '#89CFF0', '#A1CAF1'][i % 12];
                }) || [],
              },
            ]
          },
          options: this.lineChartOptions
        });
      });
  }

  ngAfterViewInit() {

  }
}
