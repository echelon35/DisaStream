import { Injectable } from "@angular/core";
// import { PopUpService } from "./pop-up.service";
import { Earthquake } from "src/app/Model/Earthquake";
import L from "leaflet";
import 'leaflet.markerclusterv2';
import { Flood } from "src/app/Model/Flood";
import { DetailService } from "src/app/Services/DetailService";
import { Alert } from "src/app/Model/Alert";
import { Eruption } from "src/app/Model/Eruption";
import { Hurricane } from "src/app/Model/Hurricane";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private detailService: DetailService){}


  /**
   * Creation of an earthquake marker
   * @param map 
   * @param layer 
   * @param earthquake 
   * @param cluster 
   * @param clickableMarker 
   */
  makeEarthquakeMarkers(map: L.Map, layer: L.LayerGroup, earthquake:Earthquake, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true, selected = false): void{

    if(earthquake != null && map != null){
        const lon = earthquake?.point?.coordinates[0];
        const lat = earthquake?.point?.coordinates[1];
        const latlng = [lat,lon];
        const marker = this.apparenceEarthquake(earthquake,latlng, selected);

        if(clickableMarker){
          marker.on('click',() => {
            const lon = earthquake.point.coordinates[0];
            const lat = earthquake.point.coordinates[1];

            if(lon && lat){
                map.setView([lat,lon], undefined, { animate: true });
            }
            this.detailService.setDisasterDetail(earthquake);
            this.detailService.setDisasterTitle(`Séisme M${earthquake.magnitude}`);
            this.detailService.show();
          })
        }

        if(addOnCluster && cluster != null){
          marker.addTo(cluster!);
          cluster.setZIndex(4);
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
   * @param flood 
   * @param cluster 
   * @param clickableMarker 
   */
  makeFloodMarkers(map: L.Map, layer: L.LayerGroup, flood:Flood, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true): void{

      if(flood != undefined && map != undefined){
          const lon = flood.point.coordinates[0];
          const lat = flood.point.coordinates[1];
          const latlng = [lat,lon];
          const marker = this.apparenceFlood(flood,latlng);

          if(clickableMarker){
            marker.on('click',() => {

              const lon = flood.point.coordinates[0];
              const lat = flood.point.coordinates[1];

              if(lon && lat){
                  map.setView([lat,lon], undefined, { animate: true });
              }

              this.detailService.setDisasterDetail(flood);
              this.detailService.show();
            })
          }

          //Surface de l'inondation
          if(flood.surface != null){
            const flSurface = L.geoJSON(flood.surface);
            flSurface.setStyle({
              color: '#00C0FF',
              weight: 2
            })
            flSurface.setZIndex(4)
            flSurface.addTo(layer);

            // layer.addTo(map);
          }

          if(addOnCluster && cluster != null){
            marker.addTo(cluster!);
            cluster!.addTo(map);
            layer.addTo(map);
          }
          else{
            marker?.addTo(layer);
            layer?.addTo(map);
          }
  
        
      }
  
  }

  /**
   * Creation of an eruption marker
   * @param map 
   * @param layer 
   * @param flood 
   * @param cluster 
   * @param clickableMarker 
   */
  makeEruptionMarkers(map: L.Map, layer: L.LayerGroup, eruption:Eruption, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true): void{

      if(eruption != undefined && map != undefined){
          const lon = eruption.point.coordinates[0];
          const lat = eruption.point.coordinates[1];
          const latlng = [lat,lon];
          const marker = this.apparenceEruption(eruption,latlng);

          if(clickableMarker){
            marker.on('click',() => {
              const lon = eruption.point.coordinates[0];
              const lat = eruption.point.coordinates[1];
              if(lon && lat){
                  map.setView([lat,lon],5, { animate: true });
              }

              this.detailService.setDisasterDetail(eruption);
              this.detailService.show();
            })
          }

          //Surface de l'inondation
          if(eruption.surface != null){
            const voSurface = L.geoJSON(eruption.surface);
            voSurface.setStyle({
              color: 'rgb(220 38 38)',
              weight: 2
            })
            voSurface.setZIndex(4)
            voSurface.addTo(layer);

            // layer.addTo(map);
          }

          if(addOnCluster && cluster != null){
            marker.addTo(cluster!);
            cluster!.addTo(map);
            layer.addTo(map);
          }
          else{
            marker?.addTo(layer);
            layer?.addTo(map);
          }
  
        
      }
  
  }

  /**
   * Creation of an eruption marker
   * @param map 
   * @param layer 
   * @param flood 
   * @param cluster 
   * @param clickableMarker 
   */
  makeHurricaneMarkers(map: L.Map, layer: L.LayerGroup, hurricane:Hurricane, cluster: L.MarkerClusterGroup | null, clickableMarker: boolean, addOnCluster = true): void{

      if(hurricane != undefined && map != undefined){
          const lon = hurricane.point.coordinates[0];
          const lat = hurricane.point.coordinates[1];
          const latlng = [lat,lon];
          const marker = this.apparenceHurricane(hurricane,latlng);

          if(clickableMarker){
            marker.on('click',() => {

              const lon = hurricane.point.coordinates[0];
              const lat = hurricane.point.coordinates[1];

              if(lon && lat){
                  map.setView([lat,lon],5, { animate: true });
              }

              this.detailService.setDisasterDetail(hurricane);
              this.detailService.show();
            })
          }

          //Surface du cyclone
          if(hurricane.surface != null){
            const huSurface = L.geoJSON(hurricane.surface);
            huSurface.on('mousedown',() => {
              huSurface.bringToFront();
            })
            huSurface.on('mouseup',() => {
              huSurface.bringToBack();
            })
            huSurface.setStyle({
              color: 'rgb(156 163 175)',
              weight: 2
            })
            huSurface.setZIndex(4)
            huSurface.bindTooltip(`${hurricane.name}`, {sticky: true})
            huSurface.addTo(layer);

            // layer.addTo(map);
          }

          if(hurricane.forecast != null){
            const huSurface = L.geoJSON(hurricane.forecast);
            huSurface.setStyle({
              color: 'rgb(248 113 113)',
              weight: 2
            })
            huSurface.setZIndex(4)
            huSurface.bindTooltip(`${hurricane.name}`, {sticky: true})
            huSurface.addTo(layer);

            // layer.addTo(map);
          }

          if(hurricane.path != null){
            const huSurface = L.geoJSON(hurricane.path);
            huSurface.setStyle({
              color: 'rgb(248 113 113)',
              weight: 2
            })
            huSurface.setZIndex(4)
            huSurface.bindTooltip(`${hurricane.name}`, {sticky: true})
            huSurface.addTo(layer);

            // layer.addTo(map);
          }

          if(addOnCluster && cluster != null){
            marker?.bindTooltip(`${hurricane.name}`, {sticky: true})
            marker.addTo(cluster!);
            cluster!.addTo(map);
            layer.addTo(map);
          }
          else{
            marker?.bindTooltip(`${hurricane.name}`, {sticky: true})
            marker?.addTo(layer);
            layer?.addTo(map);
          }
  
        
      }
  
  }

  /**
   * Area of alert
   * @param map 
   * @param layer 
   * @param alert
   */
  makeAlertShapes(map: L.Map, layer: L.LayerGroup, alert: Alert): L.LayerGroup | null {

      if(alert != undefined && map != undefined && alert.areas != null){

        //Zone de l'alerte
        const areaSurface = L.geoJSON(alert.areas);
        areaSurface.setStyle({
          color: '#6a55af',
          weight: 2
        })
        areaSurface.setZIndex(4)
        areaSurface.addTo(layer);
        layer.addTo(map);

        return areaSurface;
        
      }

      return null;
  
  }

  /**
   * Apparence du marqueur d'un séisme
   * @param feature 
   * @param latlng 
   * @returns 
   */
  apparenceEarthquake(feature,latlng,selected = false): L.Marker{

    console.log(feature);
    const path = (selected) ? "assets/images/markers/selected" : "assets/images/markers";
    let marker;
    if(feature.magnitude > 6.5){
      const bigIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: path + "/max-earthquake.svg",	
        iconSize:     [34, 40], // size of icon
        iconAnchor:   [17, 20], // marker position on icon
        popupAnchor:  [0, -20] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: bigIcon});
      marker.setZIndexOffset(3);
      
    }
    else if(feature.magnitude > 5.5){
      const mediumIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: path + "/med-earthquake.svg",	
        iconSize:     [30, 34], // size of icon
        iconAnchor:   [15, 17], // marker position on icon
        popupAnchor:  [0, -17] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: mediumIcon});
      marker.setZIndexOffset(2);

    }
    else{
      const smallIcon = L.icon({
        className: 'leaflet-pulsing-icon',
        iconUrl: path + "/min-earthquake.svg",	
        iconSize:     [24, 28], // size of icon
        iconAnchor:   [12, 14], // marker position on icon
        popupAnchor:  [0, -14] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      marker = L.marker(latlng,{icon: smallIcon});
      marker.setZIndexOffset(1);

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

  /**
   * Apparence du marqueur d'une éruption
   * @param feature 
   * @param latlng 
   * @returns 
   */
  apparenceEruption(feature,latlng){

      const smallIcon = L.icon({
        iconUrl: "assets/images/markers/eruption.svg",	
        iconSize:     [24, 28], // size of icon
        iconAnchor:   [12, 14], // marker position on icon
        popupAnchor:  [0, -14] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      const marker = L.marker(latlng,{icon: smallIcon});
      marker.setZIndexOffset(1000);
    
      return marker;
    
  }

  /**
   * Apparence du marqueur d'un cyclone
   * @param feature 
   * @param latlng 
   * @returns 
   */
  apparenceHurricane(feature,latlng){

      const smallIcon = L.icon({
        iconUrl: "assets/images/markers/hurricane.svg",	
        iconSize:     [24, 28], // size of icon
        iconAnchor:   [12, 14], // marker position on icon
        popupAnchor:  [0, -14] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
      });
      const marker = L.marker(latlng,{icon: smallIcon});
      marker.setZIndexOffset(1000);
    
      return marker;
    
  }

}
