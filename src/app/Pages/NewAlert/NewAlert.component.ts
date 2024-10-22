import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Alea } from "src/app/Model/Alea";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";

@Component({
    templateUrl: './NewAlert.component.html',
    styleUrls: ['./NewAlert.component.css'],
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);

    public alert: Alert = new Alert();
    public loadedAlert: Subject<Alert> = new Subject<Alert>();

    formGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    constructor(private alertApiService: AlertApiService, private router: Router, private route: ActivatedRoute, private toastrService: ToastrService){
      if(this.route.snapshot.queryParamMap.get('id') != null){
        const id = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        console.log(id);
        this.alertApiService.getAlertById(id).subscribe({
          next: (alert) => {
            this.loadedAlert.next(alert);
            this.alert = alert;
          },
          error: (error) => { 
            if(error.status == 403){
              this.router.navigateByUrl('dashboard/alerts/manage').then(() => { this.toastrService.error('Vous n\'êtes pas autorisé à accéder à cette alerte'); 
            })}
            else {
              this.toastrService.error(error?.message);
            }
          }
        })
      }
    }

    /**
     * First step -> Get areas
     * @param layer 
     */
    areaAlert(layer: L.GeoJSON | null){
      if(layer != null){
        const collection = layer?.toGeoJSON() as FeatureCollection;
        this.alert.areas = collection?.features[0]?.geometry;
      }
      else{
        this.alert.areas = null;
      }
      console.log(this.alert.areas);
    }

    addMails(mails: MailAlert[]){
      this.alert.mailAlerts = mails;
    }

    /**
     * Second step -> Get aleas
     */
    selectAleas(aleas: Alea[]){
      this.alert.aleas = aleas;
      console.log(this.alert.aleas);
    }

    createAlert(){
      if(this.formGroup.value.name != null){
        this.alert.name = this.formGroup.value.name;
        this.alertApiService.createAlert(this.alert).subscribe(() => {
          this.router.navigateByUrl('/dashboard/alert/success?name=' + encodeURI(this.alert.name));
        });
      }
    }
}