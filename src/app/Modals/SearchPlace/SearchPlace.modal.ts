
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Place } from 'src/app/Model/Place';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
    selector: "app-search-place-modal",
    styleUrls: ['./SearchPlace.modal.css'],
    templateUrl: './SearchPlace.modal.html',
})
export class SearchPlace {

    env = environment;
    appName: string = this.env.settings.appName;
    loading = false;

    isVisible = false;
    private wasInside = false;

    public selectedPlace = "";
    public selectedTown?: Place;
    public filterPlace = "";
    public townList: Place[] = [];
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

    show() {
      this.isVisible = true;
    }
  
    close() {
      this.isVisible = false;
    }

    chooseTown(town: Place){
      this.selectedTown = town;
      this.locationZoom(town.boundingbox);
      this.close();
    }

    setSearchPlace(){
      this.searchPlace();
    }

    clear(){
      this.filterPlace = "";
      this.townList = [];
    }

    @HostListener('click')
    clickIn() {
      this.wasInside = true;
      if(!this.isVisible){
        this.show();
      }
    }

    @HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        if(this.isVisible){
          this.close();
        }
      }
      this.wasInside = false;
    }
  
    searchPlace(){
      this.loading = true;
      this.townList = [];
      const provider = new OpenStreetMapProvider({ params: {
        'accept-language': 'fr',
        addressdetails: 1,
        format: "json",
        limit: 100,
        extratags: 1
      }});
      provider.search({ query: this.filterPlace }).then((res) => {
          this.townList = [];
          console.log(res);
          this.show();
          res.filter(item => item.raw.type != null && this.acceptedTypes.find(element => element == item.raw.type)).forEach(cursor => {
            const thisPlace = new Place();
            thisPlace.copyFromOpenStreetmapProvider(cursor);
            this.townList.push(thisPlace);
          })
          this.loading = false;
      });
  
    }

    locationZoom(boundingbox: L.LatLngBounds){
      if(this.areaMap !== undefined){
          this.areaMap.fitBounds(boundingbox);
      }
    }

}