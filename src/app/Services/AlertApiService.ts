import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthentificationApi } from "./AuthentificationApi.service";
import { Alert } from "../Model/Alert";

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
}