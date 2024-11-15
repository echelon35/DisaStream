import { Injectable } from "@angular/core";
// import { PopUpService } from "./pop-up.service";
import { Earthquake } from "src/app/Model/Earthquake";
import L from "leaflet";
import 'leaflet.markerclusterv2';
import { Flood } from "src/app/Model/Flood";
import { DetailService } from "src/app/Services/DetailService";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private detailService: DetailService){}


  /**
   * Creation of an earthquake marker
   * @param map 
   * @param layer 
   * @param res 
   * @param cluster 
   * @param clickableMarker 
   */
  makeEarthquakeMarkers(map: L.Map, layer: L.LayerGroup, earthquake:Earthquake, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true): void{

    if(earthquake != undefined && map != undefined){
        const lon = earthquake.point.coordinates[0];
        const lat = earthquake.point.coordinates[1];
        const latlng = [lat,lon];
        const marker = this.apparenceEarthquake(earthquake,latlng);

        // if(clickableMarker){
        //   var popup = this.popupService.makeSeismePopup(earthquake);
        //   marker.bindPopup(popup,{closeButton: false, closeOnClick: true, className: ""});
        // }

        if(addOnCluster && cluster != null){
          marker.addTo(cluster!);
          cluster!.addTo(map);
        }
        else{
          marker.addTo(layer);
          layer.addTo(map);
        }

      
    }

  }

  /**
   * Creation of a flood marker
   * @param map 
   * @param layer 
   * @param res 
   * @param cluster 
   * @param clickableMarker 
   */
    makeFloodMarkers(map: L.Map, layer: L.LayerGroup, flood:Flood, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true): void{

      if(flood != undefined && map != undefined){
          const lon = flood.point.coordinates[0];
          const lat = flood.point.coordinates[1];
          const latlng = [lat,lon];
          const marker = this.apparenceFlood(flood,latlng);
  
          // if(clickableMarker){
          //   var popup = this.popupService.makeSeismePopup(earthquake);
          //   marker.bindPopup(popup,{closeButton: false, closeOnClick: true, className: ""});
          // }
        marker.on('click',() => {
          this.detailService.setDisasterDetail(flood);
        })

        //Surface de l'inondation
        if(flood.surface != null){
          const flSurface = L.geoJSON(flood.surface);
          flSurface.setStyle({
            color: '#00C0FF',
            weight: 2
          })
          flSurface.setZIndex(4)
          flSurface.addTo(map);

          // layer.addTo(map);
        }
        // else{
          if(addOnCluster && cluster != null){
            marker.addTo(cluster!);
            cluster!.addTo(map);
          }
          else{
            marker.addTo(layer);
            layer.addTo(map);
          }
        // }
  
        
      }
  
    }

  /**
   * Apparence du marqueur d'un séisme
   * @param feature 
   * @param latlng 
   * @returns 
   */
  apparenceEarthquake(feature,latlng){

    let marker;
    if(feature.magnitude > 6.5){
      const bigIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: "assets/images/markers/max-seisme.svg",	
        iconSize:     [34, 40], // size of icon
        iconAnchor:   [17, 20], // marker position on icon
        popupAnchor:  [0, -20] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: bigIcon});
      marker.setZIndexOffset(3000);
      
    }
    else if(feature.magnitude > 5.5){
      const mediumIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: "assets/images/markers/med-seisme.svg",	
        iconSize:     [30, 34], // size of icon
        iconAnchor:   [15, 17], // marker position on icon
        popupAnchor:  [0, -17] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: mediumIcon});
      marker.setZIndexOffset(2000);

    }
    else{
      const smallIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: "assets/images/markers/min-seisme.svg",	
        iconSize:     [24, 28], // size of icon
        iconAnchor:   [12, 14], // marker position on icon
        popupAnchor:  [0, -14] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: smallIcon});
      marker.setZIndexOffset(1000);

    }
  
    return marker;
  
  }

    /**
   * Apparence du marqueur d'un séisme
   * @param feature 
   * @param latlng 
   * @returns 
   */
    apparenceFlood(feature,latlng){

      const smallIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: "assets/images/markers/flood.svg",	
        iconSize:     [24, 28], // size of icon
        iconAnchor:   [12, 14], // marker position on icon
        popupAnchor:  [0, -14] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      const marker = L.marker(latlng,{icon: smallIcon});
      marker.setZIndexOffset(1000);
    
      return marker;
    
    }

}
