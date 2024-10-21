import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AlertApiService } from 'src/app/Services/AlertApiService';

@Component({
  templateUrl: './Dashboard.view.html',
  styleUrls: ['./Dashboard.view.css'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class DashboardView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Semaine',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
    },

  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  datas: number[] = [];
  legends: string[] = [];

  constructor(private readonly alertApiService: AlertApiService){
    this.lastWeek();
  }

  async lastWeek(){
    this.alertApiService.getLastWeekStatistics().subscribe(periods => {
      this.lineChartData.datasets[0].data = [];
      this.lineChartData.labels = [];
      console.log(periods)
      periods.map(item => {
        this.lineChartData.datasets[0].data.push(item.count);
        this.lineChartData.labels?.push(item.periodItem);
      });
      for (let j = 0; j < periods.length; j++) {
        this.lineChartData.datasets[0].data[j] = periods[j].count;
        this.lineChartData.labels[j] = periods[j].periodItem;
      }
      console.log(this.chart?.data?.datasets[0].data);
      console.log(this.chart?.labels);
      this.chart?.update();
      // this.lineChartData.datasets[0].data = periods.keys['count'];
      // this.lineChartData.labels = periods.keys['periodItem'];
    })
  }
}