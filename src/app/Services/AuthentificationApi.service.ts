import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const env = environment;
const API_URL = `${env.settings.backend}`;
const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationApi {
    private httpOptions = {};

    constructor(private http: HttpClient){
        this.httpOptions = {
            headers: new HttpHeaders({ 
              'Content-Type': 'application/json', 
            })
          };
    }

    googleLogin(): void {
        window.location.href = API_URL + '/auth/google';
    }

    public saveToken(token: string): void {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    
    public getToken(): string | null {
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
    }
}