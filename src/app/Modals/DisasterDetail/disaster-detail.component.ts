import { Component } from "@angular/core";
import L from "leaflet";
import { MarkerService } from "src/app/Map/Services/marker.service";
import { Flood } from "src/app/Model/Flood";
import { DetailService } from "src/app/Services/DetailService";

@Component({
    selector: "app-disaster-detail",
    templateUrl: './disaster-detail.component.html',
    styleUrls: ['./disaster-detail.component.css']
})
export class DisasterDetailComponent {
    disaster$ = this.detailService.disasterDetail$;
    detailMap: L.Map;
    detailLayer: L.LayerGroup;

    constructor(private detailService: DetailService, private markerService: MarkerService){
        this.detailLayer = new L.LayerGroup();
    }

    receiveMap(map: L.Map){
        this.detailMap = map;
        this.disaster$.subscribe(item => {
            if(item != null && this.detailMap != null){
                const lng = item?.point.coordinates[0];
                const lat = item?.point.coordinates[1];
                this.markerService.makeFloodMarkers(this.detailMap, this.detailLayer, item as Flood, null, false, false)
                this.detailMap.setView([lat,lng],5);
            }
        })
    }

}