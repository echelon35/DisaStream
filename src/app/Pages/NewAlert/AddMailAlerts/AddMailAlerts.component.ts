import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AddMailAlert } from "src/app/Modals/AddMailAlert/AddMailAlert.modal";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { ToastrService } from "src/app/Shared/Services/toastr.service";


@Component({
    selector: "app-add-mail-alerts",
    templateUrl: './AddMailAlerts.component.html',
    styleUrls: ['./AddMailAlerts.component.css']
})
export class AddMailAlertsComponent implements OnInit, OnDestroy {

    public mailAlerts: MailAlert[] = [];

    private eventsSubscription!: Subscription;
    @Input()
    loadingAlert!: Observable<Alert>;

    ngOnInit(): void {
        this.eventsSubscription = this.loadingAlert?.subscribe((alert) => {
            console.log(alert);
            this.mailAlertsSelected.setValue(alert.mailAlerts);
        });
    }

    ngOnDestroy() {
        this.eventsSubscription?.unsubscribe();
    }

    mailAlertsSelected = new FormControl();
    @Output() mailAlertsChange = new EventEmitter<MailAlert[]>();
    @Output() completeStep = new EventEmitter<string>();
    @ViewChild('modal') modal?: AddMailAlert;
    
    constructor(private readonly alertApiService: AlertApiService, private readonly toastrService: ToastrService){
        this.feedMailAlertList();
    }

    /**
     * Get mail alerts
     */
    feedMailAlertList(): void{
        this.alertApiService.getMailAlerts().subscribe((ma) => {
            this.mailAlerts = ma;
        })
    }

    selectMails(){
        const values = this.mailAlertsSelected.value;
        console.log(values);
        this.mailAlertsChange.emit(values);
    }

    previousStep(){
        this.selectMails();
        this.completeStep.emit('alea-step');
    }

    nextStep(){
        this.selectMails();
        if(this.mailAlertsSelected.value){
            this.completeStep.emit('final-step');
        }
        else{
            this.toastrService.error('Vous devez selectionner au moins une adresse mail.')
        }
    }

    addMail(){
        this.modal?.open();
    }

    addCreatedMail(event: MailAlert){
        this.feedMailAlertList();
    }
    

}