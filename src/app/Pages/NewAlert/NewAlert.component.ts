import { Component, ElementRef, HostListener, ViewChild, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import { Subject } from "rxjs";
import { Alea } from "src/app/Model/Alea";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { ToastrService } from "src/app/Shared/Services/toastr.service";
import { AddMailAlert } from "src/app/Modals/AddMailAlert/AddMailAlert.modal";
import { AuthentificationApi } from "src/app/Services/AuthentificationApi.service";

@Component({
    templateUrl: './NewAlert.component.html',
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);

    public alert: Alert = new Alert();
    public loadedAlert: Subject<Alert> = new Subject<Alert>();
    panelVisible = true;

    //Area
    areaMap?: L.Map;
    allLayers?: L.GeoJSON;
    selectedLayer?: L.GeoJSON;
    public locationBox?: L.LatLngBounds;

    //team
    public mailAlerts: MailAlert[] = [];
    
    @ViewChild('modal') modal?: AddMailAlert;

    formGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    constructor(private alertApiService: AlertApiService, 
      private router: Router, 
      private route: ActivatedRoute, 
      private toastrService: ToastrService,
      private authService: AuthentificationApi){
      // if(this.route.snapshot.queryParamMap.get('id') != null){
      //   const id = parseInt(this.route.snapshot.queryParamMap.get('id')!);
      //   console.log(id);
      //   this.alertApiService.getAlertById(id).subscribe({
      //     next: (alert) => {
      //       this.loadedAlert.next(alert);
      //       this.alert = alert;
      //     },
      //     error: (error) => { 
      //       if(error.status == 403){
      //         this.router.navigateByUrl('dashboard/alerts/manage').then(() => { this.toastrService.error('Vous n\'êtes pas autorisé à accéder à cette alerte'); 
      //       })}
      //       else {
      //         this.toastrService.error(error?.message);
      //       }
      //     }
      //   })
      // }
      this.alertApiService.getMailAlerts().subscribe((ma) => {
        this.mailAlerts = ma;
        console.log(this.mailAlerts)
      })

      console.log(this.alert.areas);
    }

    showPanel(){
      this.panelVisible = !this.panelVisible;
    }

    @HostListener('keydown.esc', ['$event'])
    onEsc(event: KeyboardEvent) {
      if(this.areaMap != null){
        this.areaMap.pm.disableDraw();
        if(!this.panelVisible){
          this.showPanel();
        }
      }
    }

    /**
     * First step -> Get areas
     * @param layer 
     */
    areaAlert(layer: L.GeoJSON | null){
      if(layer != null){
        const collection = layer?.toGeoJSON() as FeatureCollection;
        this.alert.areas = collection?.features[0]?.geometry;
      }
      else{
        this.alert.areas = null;
      }
      console.log(this.alert.areas);
    }

    addMails(mails: MailAlert[]){
      this.alert.mailAlerts = mails;
    }

    /**
     * Second step -> Get aleas
     */
    selectAleas(aleas: Alea[]){
      this.alert.aleas = aleas;
      console.log(this.alert.aleas);
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

    receiveMap(map: L.Map) {
      this.areaMap = map;
    }

    /**
     * Draw polygon form by clicking the button
     */
    drawPolygon(): void {
      if(this.areaMap !== undefined){
          if(this.panelVisible){
            this.showPanel();
          }
          // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
          this.areaMap.pm.enableDraw("Polygon", {
              snappable: true,
              snapDistance: 5,
          });
      }
    }

    deleteArea(){
      this.allLayers?.clearLayers();
      this.alert.areas = null;
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

      if(this.allLayers != null){
        const collection = this.allLayers?.toGeoJSON() as FeatureCollection;
        this.alert.areas = collection?.features[0]?.geometry;
      }

      if(!this.panelVisible){
        this.showPanel();
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
            // this.areaChange.emit(this.allLayers);
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

    testFullObject(){
      if(this.formGroup.value.name != null){
        this.alert.name = this.formGroup.value.name;
        // this.alertApiService.createAlert(this.alert).subscribe(() => {
        //   this.router.navigateByUrl('/dashboard/alert/success?name=' + encodeURI(this.alert.name));
        // });
      }
      console.log(this.alert);
    }

    addTeamMember(){
      this.modal?.open();
    }

    addCreatedMail(){
      this.alertApiService.getMailAlerts().subscribe((ma) => {
        this.mailAlerts = ma;
      })
    }
}