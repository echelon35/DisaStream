
import { Component, EventEmitter, Output } from '@angular/core';
import { MailAlert } from 'src/app/Model/MailAlert';
import { AlertApiService } from 'src/app/Services/AlertApiService';
import { environment } from 'src/environments/environment';

@Component({
    selector: "app-mail-alert-modal",
    styleUrls: ['./AddMailAlert.modal.css'],
    templateUrl: './AddMailAlert.modal.html',
})
export class AddMailAlert {

    env = environment;
    appName: string = this.env.settings.appName;
    mailToAdd: MailAlert = new MailAlert();
    @Output() createdMail = new EventEmitter<MailAlert>();

    isVisible = false;
    messageToDisplay = '';

    constructor(private readonly alertApiService: AlertApiService){}

    addMail(){
      if(this.mailToAdd.mail != ''){
        this.alertApiService.addMailAlert(this.mailToAdd.mail).subscribe((message) => {
          this.messageToDisplay = message;
          this.createdMail.emit(this.mailToAdd);
        },(err) => {
          console.log(err)
          this.messageToDisplay = err.error.error;
        });
      }
    }

    open() {
      this.isVisible = true;
      //Reset before open
      this.mailToAdd = new MailAlert();
      this.messageToDisplay = '';
    }
  
    close() {
      this.isVisible = false;
    }

}