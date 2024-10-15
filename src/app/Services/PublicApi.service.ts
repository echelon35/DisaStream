import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AleaCategory } from "../Model/AleaCategory";
import { AleaCategoryDto } from "../DTO/AleaCategory.dto";
import { Observable } from "rxjs";

const env = environment;
const API_URL = `${env.settings.backend}`;

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
    private httpOptions = {};

    constructor(private http: HttpClient){
        this.httpOptions = {
            headers: new HttpHeaders({ 
              'Content-Type': 'application/json', 
            })
          };
    }

    getAleasByCategory(): Observable<AleaCategoryDto[]>{
      return this.http.get<AleaCategoryDto[]>(API_URL + '/aleas', { responseType: 'json' });
    }
}