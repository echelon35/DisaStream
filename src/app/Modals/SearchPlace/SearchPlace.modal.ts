
import { Component, Input, OnInit } from '@angular/core';
import { Place } from 'src/app/Model/Place';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
    selector: "app-search-place-modal",
    styleUrls: ['./SearchPlace.modal.css'],
    templateUrl: './SearchPlace.modal.html',
})
export class SearchPlace implements OnInit {

    env = environment;
    appName: string = this.env.settings.appName;

    isVisible: boolean = false;

    public selectedPlace: string = "";
    public selectedTown?: Place;
    public filterPlace: string = "";
    public townList: Place[] = [];
    @Input() cursorLayer?: L.LayerGroup;
    @Input() areaMap?: L.Map;

    acceptedTypes: string[] = [
        "administrative",
        "volcano", //VOLCANS
        "river", //COURS D'EAU
        "peak", //MONTAGNE
        "ocean", //OCEAN
        "sea", //MER
        "desert", //DESERT
        "wood", //BOIS
        "attraction" //LIEUX TOURISTIQUES
    ]

    constructor() {
    }

    ngOnInit(): void {
    }

    open() {
      this.isVisible = true;
    }
  
    close() {
      this.isVisible = false;
    }

    removeCursors(){
        if(this.cursorLayer !== undefined){
            this.cursorLayer.eachLayer(function(layer){
                layer.unbindTooltip();
            })
        }
    }

    moveCursor(id: string, label: string){

        if(this.cursorLayer !== undefined){
            this.cursorLayer.eachLayer(function(layer){
                layer.unbindTooltip();
                if(layer.getAttribution !== undefined){
                    if(layer.getAttribution() == id){
                        var tt = new L.Tooltip({direction:'bottom'}).setContent(`${label}`);
                        layer.bindTooltip(tt);
                        layer.openTooltip();
                      }
                }
          
              })
        }
      }

      chooseTown(town: Place){
        this.selectedTown = town;
        this.locationZoom(town.boundingbox);
        this.close();
      }

      setSearchPlace(){
        // this.countryListFiltered = this.countryList.filter(item => item.namefr.toLowerCase().includes(this.filterPlace.toLowerCase()))
        this.searchPlace();
      }
    
      searchPlace(){
        this.townList = [];
        this.razMarkers();
        const provider = new OpenStreetMapProvider({ params: {
          'accept-language': 'fr',
          addressdetails: 1,
          format: "json",
          limit: 100,
          extratags: 1
        }});
        provider.search({ query: this.filterPlace }).then((res) => {
          console.log(res);
          console.log(this.cursorLayer);
          if(this.cursorLayer !== undefined){
            this.cursorLayer.clearLayers();
            this.townList = [];
            res.filter(item => item.raw.type != null && this.acceptedTypes.find(element => element == item.raw.type)).forEach(cursor => {
              var thisPlace = new Place();
              thisPlace.copyFromOpenStreetmapProvider(cursor);
              this.townList.push(thisPlace);
              var newCursor = new L.Marker([thisPlace.latitude,thisPlace.longitude],{
                icon: new L.Icon({
                  iconUrl: "assets/svg/map-pin.svg",	
                  iconSize:     [40, 40], // size of icon
                  iconAnchor:   [20, 40], // marker position on icon
                  popupAnchor:  [0, -20] // point depuis lequel la popup doit s'ouvrir relativement à l'iconAnchor
                }),
                attribution: `${thisPlace.id}`
              });
      
              newCursor.addTo(this.cursorLayer!);
            })
          }
        });
    
      }

      locationZoom(boundingbox: L.LatLngBounds){
        if(this.areaMap !== undefined){
            this.areaMap.fitBounds(boundingbox);
        }
      }
    
      razMarkers(){
        if(this.cursorLayer !== undefined){
            this.cursorLayer.clearLayers();
        }
      }

}