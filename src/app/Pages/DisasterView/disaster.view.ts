import { Component, ViewChild } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import L from "leaflet";
import 'leaflet.markerclusterv2';
import { MarkerService } from "src/app/Map/Services/marker.service";
import { DisasterDetailComponent } from "src/app/Modals/DisasterDetail/disaster-detail.component";
import { Earthquake } from "src/app/Model/Earthquake";
import { Flood } from "src/app/Model/Flood";
// import { LoaderService } from "src/app/Services/Loader.service";

@Component({
    templateUrl: './disaster.view.html',
    styleUrls: ['./disaster.view.css']
  })
export class DisasterView {

    disastersMap?: L.Map;
    disastersLayer?: L.LayerGroup;
    protected cluster = new L.MarkerClusterGroup({showCoverageOnHover: true, maxClusterRadius: 40 });
    @ViewChild('detail') modalDetail?: DisasterDetailComponent;

    constructor(private readonly apollo: Apollo,
      private readonly markerService: MarkerService
    ){

    }

    getEarthquakes(){
      this.resetAleaLayer();

      // this.loaderService.isLoading.next(true);
      // this.loaderService.loadingPhrase.next("Ecoute des ondes sismiques en cours...")
      this.apollo.watchQuery<any>({
        query: gql`
          {
            earthquakes {
              id,
              premier_releve,
              dernier_releve,
              point
            }
          }
        `
      }).valueChanges.subscribe(gql => {
        const eqs = gql.data;
        console.log(eqs);
        eqs.earthquakes.forEach(item => {
          const eq = new Earthquake();
          eq.copyInto(item);
          this.markerService.makeEarthquakeMarkers(this.disastersMap!, this.disastersLayer!, eq, this.cluster,false,true)
        })
        // this.loaderService.isLoading.next(true);
      })
    }

    getFloods(){
      this.resetAleaLayer();

      // this.loaderService.isLoading.next(true);
      // this.loaderService.loadingPhrase.next("Ecoute des ondes sismiques en cours...")
      this.apollo.watchQuery<any>({
        query: gql`
          {
            floods {
              id,
              premier_releve,
              dernier_releve,
              point,
              surface
            }
          }
        `
      }).valueChanges.subscribe(gql => {
        const fls = gql.data;
        console.log(fls);
        fls.floods.forEach(item => {
          const fl = new Flood();
          fl.copyInto(item);
          this.markerService.makeFloodMarkers(this.disastersMap!, this.disastersLayer!,fl, this.cluster,false,true)
        })
        // this.loaderService.isLoading.next(true);
      })
    }

  /**
   * Reset la couche des aléas sur la carte
   */
  resetAleaLayer(){
    console.log(this.disastersLayer);
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
      this.getFloods();
    }

    receiveMap(map: L.Map) {
      this.disastersMap = map;
    }
}