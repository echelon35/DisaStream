import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import { Subject } from "rxjs";
import { Alea } from "src/app/Model/Alea";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { Step } from "src/app/Shared/Components/Stepper/Stepper.component";
import { ElementRef } from '@angular/core';
import { ToastrService } from "src/app/Shared/Services/toastr.service";

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

    public steps: Step[] = [{
      stepLabel: 'Où ?',
      click: () => { this.changeStep('where-step') },
      stepId: 'where-step',
      isActive: true,
      passed: false,
      iconPath: '/assets/images/svg/draw_area.svg'
    },
    {
      stepLabel: 'Quoi ?',
      click: () => { this.changeStep('alea-step') },
      stepId: 'alea-step',
      passed: false,
      isActive: false,
            iconPath: '/assets/images/svg/alea_choice.svg'
    },{
      stepLabel: 'Qui ?',
      click: () => { this.changeStep('mail-step') },
      stepId: 'mail-step',
      passed: false,
      isActive: false,
            iconPath: '/assets/images/svg/mails_to_contact.svg'
    },{
      stepLabel: 'Terminer',
      click: () => { this.changeStep('final-step') },
      isActive: false,
      iconPath: '/assets/images/svg/final_step.svg',
      stepId: 'final-step',
      passed: false,
    }]

    formGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    constructor(private alertApiService: AlertApiService, private router: Router, private route: ActivatedRoute, private toastrService: ToastrService, private elementRef: ElementRef<HTMLElement>){
      if(this.route.snapshot.queryParamMap.get('id') != null){
        const id = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        console.log(id);
        this.alertApiService.getAlertById(id).subscribe({
          next: (alert) => {
            this.loadedAlert.next(alert);
            this.alert = alert;
          },
          error: (error) => { 
            if(error.status == 403){
              this.router.navigateByUrl('dashboard/alerts/manage').then(() => { this.toastrService.error('Vous n\'êtes pas autorisé à accéder à cette alerte'); 
            })}
            else {
              this.toastrService.error(error?.message);
            }
          }
        })
      }
    }

    showPanel(){
      this.panelVisible = !this.panelVisible;
    }

   fade(element: HTMLElement) {
      let op = 1;  // initial opacity
      const timer = setInterval(function () {
          if (op <= 0.1){
              clearInterval(timer);
              element.style.display = 'none';
          }
          element.style.opacity = op.toString();
          element.style.filter = 'alpha(opacity=' + op * 100 + ")";
          op -= op * 0.1;
      }, 5);
  }

  unfade(element: HTMLElement) {
    let op = 0.1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op.toString();
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 5);
}

    changeStep(nextStep: string){
      const activeStep = this.steps.find(item => item.isActive);
      console.log(activeStep?.stepId);
      console.log(nextStep);
      if(activeStep?.stepId == nextStep){
        return;
      }
      if(activeStep){
        activeStep.passed = true;
        activeStep.isActive = false;
        const element = document.getElementById(activeStep.stepId);
        const nextElement = document.getElementById(nextStep);
        this.fade(element!);
        this.unfade(nextElement!);
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

    //Step completed by subform
    completeStep(nextStep: string){
      const step = this.steps.find(item => item.stepId == nextStep);
      step!.click();
      this.steps.forEach(item => item.isActive = false);
      step!.isActive = true;
      this.changeStep(nextStep);
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

    createAlert(){
      if(this.formGroup.value.name != null){
        this.alert.name = this.formGroup.value.name;
        this.alertApiService.createAlert(this.alert).subscribe(() => {
          this.router.navigateByUrl('/dashboard/alert/success?name=' + encodeURI(this.alert.name));
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
}