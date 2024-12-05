import { Component } from "@angular/core";
import L from "leaflet";
import { DetailService } from "src/app/Services/DetailService";

@Component({
    selector: "app-disaster-detail",
    templateUrl: './disaster-detail.component.html',
    styleUrls: ['./disaster-detail.component.css']
})
export class DisasterDetailComponent {
    disaster$ = this.detailService.disasterDetail$;
    visible$ = this.detailService.visible$;
    detailMap: L.Map;
    detailLayer: L.LayerGroup;
    mapReceived = false;

    constructor(private detailService: DetailService){
        
    }

    close(){
        this.detailService.hide();
    }

}