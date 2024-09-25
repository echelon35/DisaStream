
import { Component, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { SearchPlace } from 'src/app/Modals/SearchPlace/SearchPlace.modal';
import "@geoman-io/leaflet-geoman-free";

@Component({
    selector: 'app-new-area',
    templateUrl: './NewArea.component.html',
    styleUrls: ['./NewArea.component.css']
})
export class NewAreaView {
    
    @ViewChild('modal') modal?: SearchPlace;

    env = environment;
    appName: string = this.env.settings.appName;

    cursorLayer?: L.LayerGroup;
    editableLayer?: L.FeatureGroup;
    areaMap?: L.Map;

    selectedLayer?: L.Layer;

    deletionMode: boolean = false;

    public locationBox?: L.LatLngBounds;

    constructor() { 
        const box = [-6.113481,41.934978,10.307773,51.727030];
        this.locationBox = L.latLngBounds(L.latLng(box[3], box[2]),L.latLng(box[1], box[0]))
    }

    openModal() {
        this.modal?.open();
    }

    drawPolygon(){
        if(this.areaMap !== undefined){
            // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
            this.areaMap.pm.enableDraw("Polygon", {
                snappable: true,
                snapDistance: 5,
            });
        }
    }

    drawCircle(){
        if(this.areaMap !== undefined){
            // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
            this.areaMap.pm.enableDraw("Circle");
        }
    }

    receiveLayer(layer: L.LayerGroup) {
        this.cursorLayer = new L.LayerGroup();
        this.editableLayer = new L.FeatureGroup();
        console.log(this.cursorLayer);
        if(this.areaMap !== undefined){
            this.cursorLayer.addTo(this.areaMap);
            this.areaMap.on('pm:create', this.addShapeToMap, this);
            this.areaMap.pm.disableGlobalDragMode();
        }
        this.updateMap();
    }

    deleteShapes(sup: boolean){
        this.deletionMode = sup;
        this.deletionMode ? this.areaMap!.pm.enableGlobalRemovalMode : this.areaMap!.pm.disableGlobalRemovalMode;
    }

    addShapeToMap(e){
        (e.layer as L.Layer).addEventListener("mousedown",function(){
            this.pm.disableLayerDrag();
        });
        this.areaMap!.pm.disableDraw();
        this.areaMap!.pm.enableGlobalEditMode({
            snappable: true,
            snapDistance: 50
        });
    }

    receiveMap(map: L.Map) {
        this.areaMap = map;
        this.updateMap();
      }

    updateMap() {

    }

}