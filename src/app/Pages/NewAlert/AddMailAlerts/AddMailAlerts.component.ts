import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AddMailAlert } from "src/app/Modals/AddMailAlert/AddMailAlert.modal";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";


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
    @ViewChild('modal') modal?: AddMailAlert;
    
    constructor(private readonly alertApiService: AlertApiService){
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

    addMail(){
        this.modal?.open();
    }

    addCreatedMail(event: MailAlert){
        this.feedMailAlertList();
    }
    

}