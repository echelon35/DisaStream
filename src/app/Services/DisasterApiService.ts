import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Earthquake } from "../Model/Earthquake";
import { Observable } from "rxjs";

const env = environment;
const API_URL = `${env.settings.disasterapi}`;

@Injectable({
    providedIn: 'root'
})
export class DisasterApiService {
    private httpOptions = {};

    constructor(private http: HttpClient){
        this.httpOptions = {
            headers: new HttpHeaders({ 
              'Content-Type': 'application/json', 
            })
          };
    }

    getEarthquakes(): Observable<Earthquake[]> {
        return this.http.get<Earthquake[]>(API_URL + '/alert', this.httpOptions)
    }
}