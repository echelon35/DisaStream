
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { SearchPlace } from 'src/app/Modals/SearchPlace/SearchPlace.modal';

@Component({
    selector: 'app-new-area',
    templateUrl: './NewArea.component.html',
    styleUrls: ['./NewArea.component.css']
})
export class NewAreaView implements OnInit {
    
    @ViewChild('modal') modal?: SearchPlace;

    env = environment;
    appName: string = this.env.settings.appName;

    public locationBox?: L.LatLngBounds;

    constructor() { 
        const box = [-6.113481,41.934978,10.307773,51.727030];
        this.locationBox = L.latLngBounds(L.latLng(box[3], box[2]),L.latLng(box[1], box[0]))
    }

    ngOnInit(): void {
    }

    openModal() {
        this.modal?.open();
    }

    receiveLayer(layer: L.LayerGroup) {
        this.updateMap();
    }

    receiveMap(map: L.Map) {
        this.updateMap();
      }

    updateMap() {

    }

}