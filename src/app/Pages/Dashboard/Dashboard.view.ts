import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, Colors} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AlertApiService } from 'src/app/Services/AlertApiService';

@Component({
  templateUrl: './Dashboard.view.html',
  styleUrls: ['./Dashboard.view.css'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class DashboardView implements OnInit {
  title = 'Connectez-vous aux forces de la nature avec Disastream';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
        offset: 1
      },
    ],
    labels: ['', '', '', '', '', '', ''],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        min: 0,
        grid: {
          z: 1,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          z: 2,
        },
      },
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        beginAtZero: true,
        min: 0,
        position: 'left',
        grid: {
          z: 1,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          z: 2,
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: { display: true },
      colors: { },
      title: {
        text: 'Vos alertes de la semaine',
      }
    }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  datas: number[] = [];
  legends: string[] = [];

  constructor(private readonly alertApiService: AlertApiService){
  }

  ngOnInit(): void {
    this.lastWeek();
  }

  public lastWeek(): void{
    this.alertApiService.getLastWeekStatistics().subscribe(periods => {
      this.lineChartData.datasets[0].data = [];
      this.lineChartData.labels = [];

      this.lineChartData.labels.length = 0;
      for (let i = periods.length - 1; i >= 0; i--) {
        const currentDate = new Date(periods[i].perioditem);
        this.lineChartData.labels.push(currentDate.toLocaleDateString('fr'));
        this.lineChartData.datasets[0].data.push(periods[i].count)
      }
      this.chart?.update();
    })
  }
}