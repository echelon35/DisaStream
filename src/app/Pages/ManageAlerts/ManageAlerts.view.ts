import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Alert } from 'src/app/Model/Alert';
import { AlertApiService } from 'src/app/Services/AlertApiService';

@Component({
  templateUrl: './ManageAlerts.view.html',
  styleUrls: ['./ManageAlerts.view.css']
})
export class ManageAlertsView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';
  alerts: Alert[] = [];
  displayedColumns: string[] = ['edit','type','name','createdAt','updatedAt','delete']

  constructor(private readonly alertApiService: AlertApiService, private readonly toastrService: ToastrService, public router: Router){
    this.getAlerts();
  }

  getAlerts(){
    this.alertApiService.getUserAlerts().subscribe((alerts) => {
      this.alerts = alerts;
    })
  }

  // edit(id: number){
  //   this.router.navigateByUrl('/dashboard/alert/edit?id=' + id);
  // }

  deleteAlert(id: number){
    this.alertApiService.deleteAlert(id).subscribe((message) => this.toastrService.info(message));
    this.getAlerts();
  }


}