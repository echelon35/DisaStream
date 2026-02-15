import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import L from "leaflet";
import { DetailService } from "src/app/Services/DetailService";

@Component({
    selector: "app-disaster-detail",
    templateUrl: './disaster-detail.component.html',
    styleUrls: ['./disaster-detail.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class DisasterDetailComponent {
    disaster$ = this.detailService.disasterDetail$;
    visible$ = this.detailService.visible$;
    title$ = this.detailService.disasterTitle$;
    detailMap: L.Map;
    detailLayer: L.LayerGroup;
    mapReceived = false;

    constructor(private detailService: DetailService){
        
    }

    close(){
        this.detailService.hide();
    }

}