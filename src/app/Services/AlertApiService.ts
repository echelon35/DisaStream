import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthentificationApi } from "./AuthentificationApi.service";
import { Alert } from "../Model/Alert";
import { Observable } from "rxjs";
import { MailAlert } from "../Model/MailAlert";

const env = environment;
const API_URL = `${env.settings.backend}`;

@Injectable({
  providedIn: 'root'
})
export class AlertApiService {
    private httpOptions = {};

    constructor(private http: HttpClient, private authService: AuthentificationApi){
        this.httpOptions = {
            headers: new HttpHeaders({ 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${this.authService.getToken()}`
            })
          };
    }

    createAlert(alert: Alert){
      return this.http.post(API_URL + '/alert/create', alert, this.httpOptions);
    }

    getUserAlerts(): Observable<Alert[]> {
      return this.http.get<Alert[]>(API_URL + '/alert', this.httpOptions)
    }

    getMailAlerts(): Observable<MailAlert[]> {
      return this.http.get<MailAlert[]>(API_URL + '/alert/mails', this.httpOptions);
    }

    addMailAlert(mailToAdd: string): Observable<string> {
      const mailAlert = {
        mail: mailToAdd,
      }
      return this.http.post<string>(API_URL + '/alert/mail/create', mailAlert, this.httpOptions);
    }

    deleteAlert(alertId: number){
      return this.http.delete<string>(API_URL + '/alert/delete/' + alertId, this.httpOptions);
    }
}