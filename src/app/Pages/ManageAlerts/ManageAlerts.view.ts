import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from 'src/app/Model/Alert';
import { Country } from 'src/app/Model/Country';
import { AlertApiService } from 'src/app/Services/AlertApiService';
import { GeographyApiService } from 'src/app/Services/GeographyApi.service';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';


class AlertVm extends Alert {
  country?: Country;
}

@Component({
  templateUrl: './ManageAlerts.view.html',
})
export class ManageAlertsView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';
  alerts: AlertVm[] = [];
  displayedColumns: string[] = ['edit','type','name','createdAt','updatedAt','delete']
  loading = true;

  constructor(private readonly alertApiService: AlertApiService, 
    private readonly toastrService: ToastrService, 
    private geographyService: GeographyApiService,
    public router: Router){
    this.getAlerts();
  }

  getAlerts(){
    this.alertApiService.getUserAlerts().subscribe((alerts) => {
      this.alerts = alerts;
      this.alerts.filter(item => item.countryId != null).forEach(al => {
        this.geographyService.getCountryById(al.countryId!).subscribe(country => {
          al.country = country;
        })
      })
      this.loading = false;
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