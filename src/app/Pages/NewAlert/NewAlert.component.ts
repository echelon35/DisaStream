import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { FeatureCollection, Geometry } from "geojson";
import { Alea } from "src/app/Model/Alea";

@Component({
    templateUrl: './NewAlert.component.html',
    styleUrls: ['./NewAlert.component.css'],
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);
    private areas: Geometry[] = [];
    private aleas: Alea[] = [];

    formGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });

    /**
     * First step -> Get areas
     * @param layer 
     */
    areaAlert(layer: L.GeoJSON){
      const collection = layer?.toGeoJSON() as FeatureCollection;
      this.areas = [];
      collection?.features.forEach(item => {
        this.areas.push(item.geometry);
      })
      console.log(this.areas);
    }

    /**
     * Second step -> Get aleas
     */
    selectAleas(aleas: Alea[]){
      this.aleas = aleas
      console.log(this.aleas);
    }
}