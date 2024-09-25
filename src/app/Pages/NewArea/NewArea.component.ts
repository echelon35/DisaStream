
import { Component, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { SearchPlace } from 'src/app/Modals/SearchPlace/SearchPlace.modal';

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
            new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
        }
    }

    drawCircle(){
        if(this.areaMap !== undefined){
            new L.Draw.Circle(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7', opacity: 0.9, color: '#6a5ac7' }}).enable();
        }
    }

    receiveLayer(layer: L.LayerGroup) {
        this.cursorLayer = new L.LayerGroup();
        this.editableLayer = new L.FeatureGroup();
        console.log(this.cursorLayer);
        if(this.areaMap !== undefined){
            this.cursorLayer.addTo(this.areaMap);
            
            this.areaMap.on('draw:created', this.addShapeToMap, this);
            const drawControl = new L.Control.Draw({
                draw:{polygon: false,
                      marker: false,
                      circlemarker: false,
                      rectangle: false,
                      circle: false,
                  },
                edit: {
                  featureGroup: this.editableLayer!,
                }
              });
              this.areaMap.addControl(drawControl);
        }
        this.updateMap();
    }

    editShapes(){
        // this.areaMap?.fire(L.Draw.Event.);
    }

    addShapeToMap(e){
        const layer = (e as L.DrawEvents.Created).layer;

        const btnEdit = L.DomUtil.create('div','cursor-pointer');
        const areaMap = this.areaMap;
        btnEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
        btnEdit.addEventListener("click",function(){
            // var layer = e.layer;
            layer.fireEvent(L.Draw.Event.EDITSTART);
        });

        const btnDel = L.DomUtil.create('div','cursor-pointer');
        btnDel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
        btnDel.addEventListener("click",function(){ layer.remove()});
    
        const popup = L.DomUtil.create('div','d-flex align-items-center');
        popup.appendChild(btnEdit);
        popup.appendChild(btnDel);

        layer.bindPopup(popup, { closeButton: false })
        this.editableLayer?.addLayer(layer);
        this.areaMap!.addLayer(this.editableLayer!);
    }

    receiveMap(map: L.Map) {
        this.areaMap = map;
        this.updateMap();
      }

    updateMap() {

    }

}