
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { SearchPlace } from 'src/app/Modals/SearchPlace/SearchPlace.modal';
import "@geoman-io/leaflet-geoman-free";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Alert } from 'src/app/Model/Alert';

export interface IGeomanLayer {
    layer: L.Layer;
    shape: string;
}

@Component({
    selector: 'app-new-area',
    templateUrl: './NewArea.component.html',
    styleUrls: ['./NewArea.component.css']
})
export class NewAreaView implements OnInit, OnDestroy {
    
    @ViewChild('modal') modal?: SearchPlace;

    env = environment;
    appName: string = this.env.settings.appName;

    areaMap?: L.Map;

    selectedLayer?: L.GeoJSON;
    allLayers?: L.GeoJSON;
    completed = false;

    private eventsSubscription: Subscription | undefined;

    @Input() loadingAlert: Observable<Alert> | undefined;

    @Output() areaChange = new EventEmitter<L.GeoJSON | null>();
    @Output() completeStep = new EventEmitter<string>();

    public locationBox?: L.LatLngBounds;

    constructor(private toastrService: ToastrService) { 
        const box = [-6.113481,41.934978,10.307773,51.727030];
        this.locationBox = L.latLngBounds(L.latLng(box[3], box[2]),L.latLng(box[1], box[0]))
    }
    ngOnInit(): void {
        this.eventsSubscription = this.loadingAlert?.subscribe((alert) => {
            const geo = new L.GeoJSON(alert.areas);
            this.onEachFeature(geo);
            this.allLayers?.addLayer(geo);
            this.addShapeToMap();
            console.log(geo);
        });
    }

    ngOnDestroy() {
        this.eventsSubscription?.unsubscribe();
    }

    /**
     * Open modal for searching locaitons
     */
    openModal(): void {
        this.modal?.open();
    }

    /**
     * Draw polygon form by clicking the button
     */
    drawPolygon(): void {
        if(this.areaMap !== undefined){
            // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
            this.areaMap.pm.enableDraw("Polygon", {
                snappable: true,
                snapDistance: 5,
            });
        }
    }

    /**
     * Draw circle form by clicking the button
     */
    drawCircle(): void {
        if(this.areaMap !== undefined){
            // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
            this.areaMap.pm.enableDraw("Circle",{
                snappable: true,
                snapDistance: 5,
            });
        }
    }

    /**
     * Receive layer from the map component
     * @param layer 
     */
    receiveLayer(layer: L.LayerGroup) {
        this.selectedLayer = new L.GeoJSON(null,{
            style: {
                fillColor: '#6a5ac7'
            }
        });
        this.allLayers = new L.GeoJSON(null,{
            style: {
                fillColor: '#6a5ac7'
            }
        });
        if(this.areaMap !== undefined){
            this.allLayers!.addTo(this.areaMap);
            this.allLayers?.bringToFront()
            this.areaMap.pm.setGlobalOptions({
                layerGroup: this.allLayers,
            });
            this.areaMap.on('pm:create', this.addShapeToMap, this);
        }
    }

    /**
     * 
     * @param layer 
     */
    onEachFeature(layer){

        const btnDel = L.DomUtil.create('div','cursor-pointer');
        btnDel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`
        btnDel.addEventListener("click",() => { 
            layer.remove();
            this.allLayers?.removeLayer(layer);
            popup.close();
            this.areaChange.emit(this.allLayers);
        });
    
        const popupHtml = L.DomUtil.create('div','d-flex align-items-center');
        popupHtml.appendChild(btnDel);

        const popup = L.popup({
            closeButton: false,
            autoClose: true,
        });
        popup.setContent(popupHtml);
        
        layer.bindPopup(popup);
    }

    nbLayers() : number {
        return  this.allLayers?.getLayers().length || 0;
    }

    /**
     * After adding shape (polygon or circle) by button
     * @param e 
     */
    addShapeToMap(){

        this.allLayers?.setStyle({weight: 3,fillColor:'#ffffff', color:'white'});

        this.allLayers?.eachLayer((layer) => this.onEachFeature(layer), this)
        this.allLayers?.addTo(this.areaMap!);
        this.allLayers?.bringToFront()

        this.areaMap!.pm.disableDraw();
        this.areaMap!.pm.enableGlobalEditMode({
            snappable: true,
            snapDistance: 50
        });

        this.areaChange.emit(this.allLayers);
    }

    clickOnLayer(e){
        const layer = (e.target as L.Layer);
        const alreadySelected = this.selectedLayer!.hasLayer(layer);
        if(alreadySelected){
            this.selectedLayer!.removeLayer(layer);
        }
        else{
            this.selectedLayer!.addLayer(layer);
        }
    }

    receiveMap(map: L.Map) {
        this.areaMap = map;
    }

    allWorld(){
        this.areaChange.emit(null);
        this.completeStep.emit('alea-step');
    }

    nextStep(){
        const nbLayers = this.nbLayers();
        if(nbLayers > 0){
            this.areaChange.emit(this.allLayers);
            this.completeStep.emit('alea-step');
        }
        else{
            this.toastrService.error('Vous devez sélectionner une zone ou cliquer sur le bouton Monde Entier');
        }
    }

}