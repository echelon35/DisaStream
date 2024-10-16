import { Component } from '@angular/core';
import { Alert } from 'src/app/Model/Alert';
import { AlertApiService } from 'src/app/Services/AlertApiService';

@Component({
  templateUrl: './ManageAlerts.view.html',
  styleUrls: ['./ManageAlerts.view.css']
})
export class ManageAlertsView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';
  alerts: Alert[] = [];
  displayedColumns: string[] = ['edit','name','createdAt']

  constructor(private readonly alertApiService: AlertApiService){
    this.getAlerts();
  }

  getAlerts(){
    this.alertApiService.getUserAlerts().subscribe((alerts) => {
      this.alerts = alerts;
    })
  }


}