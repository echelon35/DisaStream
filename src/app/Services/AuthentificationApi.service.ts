import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { UserLoginDto } from "../DTO/UserLogin.dto";
import { Observable } from "rxjs";
import { CreateUserDto } from "../DTO/CreateUser.dto";
import { User } from "../Model/User";
import { TokenDto } from "../DTO/token.dto";

const env = environment;
const API_URL = `${env.settings.backend}`;
const TOKEN_KEY = 'auth-token';
const AVATAR_KEY = 'avatarUrl';
const FIRSTNAME_KEY = 'firstname';
const LASTNAME_KEY = 'lastname';

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

    public saveSummary(avatarPath: string, firstname: string, lastname: string): void {
        window.localStorage.removeItem(AVATAR_KEY);
        window.localStorage.removeItem(FIRSTNAME_KEY);
        window.localStorage.removeItem(LASTNAME_KEY);
        localStorage.setItem(AVATAR_KEY, avatarPath || '');
        localStorage.setItem(FIRSTNAME_KEY, firstname || '');
        localStorage.setItem(LASTNAME_KEY, lastname || '');
    }
    
    public getToken(): string | null {
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
    }

    public logOut() {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(AVATAR_KEY);
        window.localStorage.removeItem(FIRSTNAME_KEY);
        window.localStorage.removeItem(LASTNAME_KEY);
        window.location.href = '/';
    }

    public login(userDto: UserLoginDto): Observable<TokenDto>{
        return this.http.post<TokenDto>(API_URL + '/auth/login',userDto,this.httpOptions)
    }

    public resend(token: string): Observable<string>{
        return this.http.post<string>(API_URL + '/auth/resend-confirmation-email?token=' + token,this.httpOptions);
    }

    public register(createUserDto: CreateUserDto): Observable<User>{
        return this.http.post<User>(API_URL + '/auth/signin',createUserDto,this.httpOptions)
    }

    public confirm(token: string){
        return this.http.get<User>(API_URL + '/auth/confirm-email?token=' + token,this.httpOptions)
    }
}