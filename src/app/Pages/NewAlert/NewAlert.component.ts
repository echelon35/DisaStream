import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { FeatureCollection } from "geojson";
import { Alea } from "src/app/Model/Alea";
import { Alert } from "src/app/Model/Alert";
import { AlertApiService } from "src/app/Services/AlertApiService";

@Component({
    templateUrl: './NewAlert.component.html',
    styleUrls: ['./NewAlert.component.css'],
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);
    private alert: Alert = new Alert();

    formGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    constructor(private alertApiService: AlertApiService){}

    /**
     * First step -> Get areas
     * @param layer 
     */
    areaAlert(layer: L.GeoJSON){
      const collection = layer?.toGeoJSON() as FeatureCollection;
      this.alert.areas = collection?.features[0]?.geometry;
      console.log(this.alert.areas);
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
          console.log('Alerte créé avec succès');
        });
      }
    }
}