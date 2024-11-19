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
    styleUrls: ['./NewAlert.component.css'],
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);

    public alert: Alert = new Alert();
    public loadedAlert: Subject<Alert> = new Subject<Alert>();

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
}