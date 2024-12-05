import { Component, ViewChild } from "@angular/core";
import L from "leaflet";
import 'leaflet.markerclusterv2';
import { catchError, finalize, of, tap } from "rxjs";
import { MarkerService } from "src/app/Map/Services/marker.service";
import { DisasterDetailComponent } from "src/app/Modals/DisasterDetail/disaster-detail.component";
import { Alert } from "src/app/Model/Alert";
import { Earthquake } from "src/app/Model/Earthquake";
import { Flood } from "src/app/Model/Flood";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { DisasterApiService } from "src/app/Services/DisasterApiService";

@Component({
    templateUrl: './disaster.view.html',
  })
export class DisasterView {

    disastersMap?: L.Map;
    disastersLayer?: L.LayerGroup;
    alertsLayer?: L.LayerGroup;
    alerts: Alert[];
    selectedAleaType: string;
    loading = false;

    protected cluster = new L.MarkerClusterGroup({showCoverageOnHover: true, maxClusterRadius: 40 });
    @ViewChild('detail') modalDetail?: DisasterDetailComponent;

    constructor(
      private readonly markerService: MarkerService,
      private readonly disasterApiService: DisasterApiService,
      private readonly alertApiService: AlertApiService
    ){

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
          break;
        case 'eruption':
          break;
      }
    }

    getAreas(){
      this.alertsLayer?.clearLayers();
      this.alertApiService.getUserAlerts().subscribe((alerts) => {
        this.alerts = alerts;
        console.log(this.alerts);
        //La zone de l'alerte ne doit s'afficher que si :
        //- L'utilisateur a souhaité l'afficher via la case à cocher
        //- L'alerte concerne le type d'aléa affiché
        this.alerts.filter(i => i.areas != null).forEach(item => {
          this.markerService.makeAlertShapes(this.disastersMap!, this.alertsLayer!, item)
        })
      })
    }

    getEarthquakes(){
      this.loading = true;

      this.disasterApiService.searchEarthquakes()
      .pipe(
        tap(() => {
          // Le succès est traité ici
          console.log("Requête réussie.");
          this.loading = false;
        }),
        catchError((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la requête :", error);
          this.loading = false;
          return of(null); // Retourne un observable vide pour continuer
        }),
        finalize(() => {
          // Cela sera toujours exécuté, même en cas d'erreur
          console.log("Finalisation");
          this.loading = false;
        })
      )
      .subscribe((gql) => {
        if (!gql) return;
        const eqs = gql.data;
        eqs.earthquakes.forEach(item => {
          const eq = new Earthquake();
          eq.copyInto(item);
          this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.disastersLayer!, eq, this.cluster,true,true);
        });
      });

    }

    getFloods(){
      this.loading = true;

      this.disasterApiService.searchFloods()
      .pipe(
        tap(() => {
          // Le succès est traité ici
          console.log("Requête réussie.");
          this.loading = false;
        }),
        catchError((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la requête :", error);
          this.loading = false;
          return of(null); // Retourne un observable vide pour continuer
        }),
        finalize(() => {
          // Cela sera toujours exécuté, même en cas d'erreur
          console.log("Finalisation");
          this.loading = false;
        })
      )
      .subscribe(gql => {
        if(!gql) return;
        const fls = gql.data;
        console.log(fls);
        fls.floods.forEach(item => {
          const fl = new Flood();
          fl.copyInto(item);
          this.markerService.makeFloodMarkers(this.disastersMap!, this.disastersLayer!,fl, this.cluster,true,true)
        })
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
     * Receive layer from the map component
     * @param layer 
     */
    receiveLayer(layer: L.LayerGroup) {
      this.disastersLayer = new L.LayerGroup();
    }

    receiveMap(map: L.Map) {
      this.disastersMap = map;
      this.alertsLayer = new L.LayerGroup();
      this.getAreas();
    }
}