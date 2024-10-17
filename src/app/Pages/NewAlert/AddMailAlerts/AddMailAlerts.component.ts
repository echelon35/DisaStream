import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AddMailAlert } from "src/app/Modals/AddMailAlert/AddMailAlert.modal";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";


@Component({
    selector: "app-add-mail-alerts",
    templateUrl: './AddMailAlerts.component.html',
    styleUrls: ['./AddMailAlerts.component.css']
})
export class AddMailAlertsComponent {

    public mailAlerts: MailAlert[] = [];
    // private _formBuilder = inject(FormBuilder);
    // formMail = this._formBuilder.group({
    //     name: ['', Validators.required],
    //   });
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