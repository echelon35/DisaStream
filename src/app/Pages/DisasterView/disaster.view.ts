import { Component, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import L, { FeatureGroup } from "leaflet";
import 'leaflet.markerclusterv2';
import { Observable } from "rxjs";
import { MarkerService } from "src/app/Map/Services/marker.service";
import { DisasterDetailComponent } from "src/app/Modals/DisasterDetail/disaster-detail.component";
import { Alert } from "src/app/Model/Alert";
import { Country } from "src/app/Model/Country";
import { Earthquake } from "src/app/Model/Earthquake";
import { Eruption } from "src/app/Model/Eruption";
import { Flood } from "src/app/Model/Flood";
import { Hurricane } from "src/app/Model/Hurricane";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { DisasterApiService } from "src/app/Services/DisasterApiService";
import { GeographyApiService } from "src/app/Services/GeographyApi.service";
import { selectEarthquakes } from "src/app/Store/Selectors/earthquakes.selector";
import { selectEruptions } from "src/app/Store/Selectors/eruptions.selector";
import { selectFloods } from "src/app/Store/Selectors/floods.selector";
import { selectHurricanes } from "src/app/Store/Selectors/hurricanes.selector";
import * as EarthquakeActions from '../../Store/Actions/earthquakes.actions';
import * as EruptionActions from '../../Store/Actions/eruptions.actions';
import * as FloodsActions from '../../Store/Actions/floods.actions';
import * as HurricanesActions from '../../Store/Actions/hurricanes.actions';
import { DetailAlertComponent } from "./DetailAlert/DetailAlert.component";
import { Disaster } from "src/app/Model/Disaster";
import { CommonModule } from "@angular/common";
import { SearchPlace } from "src/app/Modals/SearchPlace/SearchPlace.modal";
import { MapComponent } from "src/app/Map/Components/map/map.component";
import { SharedModule } from "src/app/Shared/Shared.module";

class AlertVm {
  alert: Alert;
  country?: Country;
  layer: L.LayerGroup;
  visible: boolean;
}

@Component({
    templateUrl: './disaster.view.html',
    standalone: true,
    imports: [CommonModule, SharedModule, DisasterDetailComponent, DetailAlertComponent, SearchPlace, MapComponent]
})
export class DisasterView {

    disastersMap?: L.Map;
    disastersLayer?: L.LayerGroup;
    selectedLayer?: L.LayerGroup = new L.LayerGroup();
    alertsLayer?: L.LayerGroup;
    alerts: AlertVm[];
    selectedAleaType: string;
    loading = false;
    panel = '';
    lastPanel = '';
    layersDisplayed: L.LayerGroup[];
    allLayers: L.LayerGroup[];

    earthquakes$: Observable<Earthquake[]>;
    eruptions$: Observable<Eruption[]>;
    floods$: Observable<Flood[]>;
    hurricanes$: Observable<Hurricane[]>;
    error$: Observable<any>;

    selectedAlert: Alert | undefined;

    allVisible = true;

    protected cluster = new L.MarkerClusterGroup({showCoverageOnHover: true, maxClusterRadius: 10, disableClusteringAtZoom: 15});
    @ViewChild('detail') modalDetail?: DisasterDetailComponent;
    @ViewChild('detailalert') detailAlertPanel?: DetailAlertComponent;

    constructor(
      private readonly markerService: MarkerService,
      private readonly disasterApiService: DisasterApiService,
      private readonly alertApiService: AlertApiService,
      private readonly geographyService: GeographyApiService,
      private store: Store
    ){
      this.earthquakes$ = this.store.select(selectEarthquakes);
      this.eruptions$ = this.store.select(selectEruptions);
      this.floods$ = this.store.select(selectFloods);
      this.hurricanes$ = this.store.select(selectHurricanes);
      this.store.dispatch(EarthquakeActions.loadEarthquakesGeography());
      this.store.dispatch(EruptionActions.loadEruptionsGeography());
      this.store.dispatch(FloodsActions.loadFloodsGeography());
      this.store.dispatch(HurricanesActions.loadHurricanesGeography());
      this.selectPanel('area');
    }

    selectAlea(type: string){
      this.selectedAleaType = type;
      this.resetAleaLayer();
      switch(type){
        case 'earthquake':
          this.getEarthquakes();
          break;
        case 'flood':
          this.getFloods();
          break;
        case 'hurricane':
          this.getHurricanes();
          break;
        case 'eruption':
          this.getEruptions();
          break;
      }
      this.hidePanels()
    }

    selectAlert(alert: Alert | undefined){
      this.detailAlertPanel?.open(alert);
      this.selectPanel("detail-alert");
      this.zoomOnAlert(alert!);
    }

    zoomOnAlert(alert: Alert){
      this.alerts.filter(a => a.alert?.areas != null).forEach(a => {
        if(a.alert === alert){
            //Fit on alert selected
            this.disastersMap?.fitBounds((a.layer as FeatureGroup).getBounds());
            if(!a.visible){
              this.showAlertOnMap(a);
            }
        }
        else{
          if(a.visible){
            this.showAlertOnMap(a);
          }
        }
      })
    }

    closeAlert(){
      this.selectPanel('area');
      this.resetAleaLayer();
      this.resetSelectedAleaLayer();
      this.disastersMap?.setView([0,0], 2);
      this.alerts.forEach(a => {
        if(!a.visible){
          this.showAlertOnMap(a);
        }
      })
    }

    zoomOnDisaster(disaster: Disaster){
      if(disaster.point != null){
          //Fit on disaster selected
          this.selectedLayer?.clearLayers();
          this.disastersMap?.flyTo(new L.LatLng(disaster.point.coordinates[1],disaster.point.coordinates[0]), 7);
          switch(disaster.type){
            case 'earthquake':
              this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.selectedLayer!, disaster as Earthquake, null,true,false, true);
              break;
            case 'flood':
              this.markerService.makeFloodMarkers(this.disastersMap!, this.selectedLayer!, disaster as Flood, null,true,false, true);
              break;
            case 'hurricane':
              this.markerService.makeHurricaneMarkers(this.disastersMap!, this.selectedLayer!, disaster as Hurricane, null,true,false, true);
              break;
            case 'eruption':
              this.markerService.makeEruptionMarkers(this.disastersMap!, this.selectedLayer!, disaster as Eruption, null,true,false, true);
              break;
          }
      }
    }

    hoverOnDisaster(disaster: Disaster){
      if(disaster.point != null){
          //Fit on disaster selected
          this.selectedLayer?.clearLayers();
          switch(disaster.type){
            case 'earthquake':
              this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.selectedLayer!, disaster as Earthquake, null,true,false, true);
              break;
            case 'flood':
              this.markerService.makeFloodMarkers(this.disastersMap!, this.selectedLayer!, disaster as Flood, null,true,false, true);
              break;
            case 'hurricane':
              this.markerService.makeHurricaneMarkers(this.disastersMap!, this.selectedLayer!, disaster as Hurricane, null,true,false, true);
              break;
            case 'eruption':
              this.markerService.makeEruptionMarkers(this.disastersMap!, this.selectedLayer!, disaster as Eruption, null,true,false, true);
              break;
          }
      }
    }

    selectPanel(type: string){
      if(this.panel === type){
        this.hidePanels();
      }
      else{
        this.panel = type;
      }
    }

    getAreas(){
      this.alertsLayer?.clearLayers();
      this.alerts = [];
      this.alertApiService.getUserAlerts().subscribe((alerts) => {

        //La zone de l'alerte ne doit s'afficher que si :
        //- L'utilisateur a souhaité l'afficher via la case à cocher
        //- L'alerte concerne le type d'aléa affiché
        alerts.forEach(item => {
          const alertVm = new AlertVm();
          alertVm.alert = item;
          if(item.countryId){
            this.geographyService.getCountryById(item.countryId!).subscribe(country => {
              alertVm.country = country;
            })
          }
          const layer = this.markerService.makeAlertShapes(this.disastersMap!, this.alertsLayer!, item);
          if(layer != null){
            alertVm.layer = layer;
          }
          alertVm.visible = true;
          this.alerts.push(alertVm);
        })
      })
    }

    hidePanels(){
      this.lastPanel = this.panel;
      this.panel = '';
    }

    closePanel(){
      this.hidePanels();
    }

    showAllAlertOnMap(){
      if(this.allVisible) {
        this.alerts.forEach(item => {
          if(item.alert.areas != null){
            if(this.alertsLayer!.hasLayer(item.layer)) {
              this.alertsLayer!.removeLayer(item.layer);
            }
            item.visible = false;
          }
        });
        this.allVisible = false;
      } else {
        this.alerts.forEach(item => {
          if(item.alert.areas != null){
            if(!this.alertsLayer!.hasLayer(item.layer)) {
              this.alertsLayer!.addLayer(item.layer);
            }
            item.visible = true;
          }
        });
        this.allVisible = true;
      }
    }

    showAlertOnMap(alertVm: AlertVm){
      if(this.alertsLayer!.hasLayer(alertVm?.layer)) {
          this.alertsLayer!.removeLayer(alertVm?.layer);
          alertVm.visible = false;
      } else {
        this.alertsLayer!.addLayer(alertVm?.layer);
        alertVm.visible = true;
      }
    }

    getEarthquakes(){
      this.loading = true;
      this.earthquakes$.subscribe((data: any) => {
        if (!data) return;
        data?.earthquakes.forEach(item => {
          const eq = new Earthquake(item);
          this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.disastersLayer!, eq, this.cluster,true,true);
        });
        this.loading = false;
      })
    }

    getEruptions(){
      this.loading = true;
      this.eruptions$.subscribe((data: any) => {
        console.log(data);
        if (!data) return;
        data?.eruptions?.forEach(item => {
          const er = new Eruption(item);
          this.markerService.makeEruptionMarkers(this.disastersMap!, this.disastersLayer!, er, this.cluster,true,true);
        });
        this.loading = false;
      })

    }

    getFloods(){
      this.loading = true;
      this.floods$.subscribe((data: any) => {
        console.log(data);
        if (!data) return;
        data?.floods?.forEach(item => {
          const fl = new Flood(item);
          this.markerService.makeFloodMarkers(this.disastersMap!, this.disastersLayer!, fl, this.cluster,true,true);
        });
        this.loading = false;
      })
    }

    getHurricanes(){
      this.loading = true;
      this.hurricanes$.subscribe((data: any) => {
        console.log(data);
        if (!data) return;
        data?.hurricanes?.forEach(item => {
          const hu = new Hurricane(item);
          this.markerService.makeHurricaneMarkers(this.disastersMap!, this.disastersLayer!, hu, this.cluster,true,true);
        });
        this.loading = false;
      })
    }

    /**
     * Reset la couche des aléas sur la carte
     */
    resetAleaLayer(){
      if(this.disastersLayer != undefined){
        this.cluster.clearLayers();
        this.disastersLayer.clearLayers();
      }
    }

    /**
     * Reset la couche des aléas sur la carte
     */
    resetSelectedAleaLayer(){
      if(this.selectedLayer != undefined){
        this.selectedLayer.clearLayers();
      }
    }

    /**
     * Receive layer from the map component
     * @param layer 
     */
    receiveLayer(layer: L.LayerGroup) {
      this.disastersLayer = new L.LayerGroup();
    }

    receiveMap(map: L.Map) {
      this.disastersMap = map;
      this.disastersMap?.setView([0,0], 2);
      this.alertsLayer = new L.LayerGroup();
      this.getAreas();
      this.disastersMap.on('click', (e) => {
        if(this.panel !== ''){
          this.hidePanels();
        }
        else{
          this.selectPanel(this.lastPanel);
        }
      });
    }

    displayDisasters(disastersPoint: Disaster[]){
      this.resetAleaLayer();
      disastersPoint.forEach((item:Disaster) => {
        switch(item.type){
          case 'earthquake':
            this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.disastersLayer!, item as Earthquake, null,true,true);
            break;
          case 'flood':
            this.markerService.makeFloodMarkers(this.disastersMap!, this.disastersLayer!, item as Flood, null,true,true);
            break;
          case 'hurricane':
            this.markerService.makeHurricaneMarkers(this.disastersMap!, this.disastersLayer!, item as Hurricane, null,true,true);
            break;
        }
      })
    }
}