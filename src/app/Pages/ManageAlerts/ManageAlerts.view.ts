import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteConfirmModal } from 'src/app/Modals/DeleteConfirm/DeleteConfirm.modal';
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

  @ViewChild('deleteConfirmModal') deleteConfirmModal?: DeleteConfirmModal;

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

  disableAlert(id: number){
    this.alertApiService.activateAlert(id,false).subscribe(() => {
      this.toastrService.info('Alerte désactivée');
      this.getAlerts();
    });
  }

  activateAlert(id: number){
    this.alertApiService.activateAlert(id,true).subscribe(() => {
      this.toastrService.info('Alerte activée');
      this.getAlerts();
    });
  }

  deleteAlert(alert: Alert){
    this.deleteConfirmModal!.alert = alert;
    this.deleteConfirmModal!.open();
  }


}