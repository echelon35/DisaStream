import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthentificationApi } from './Services/AuthentificationApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App {

  env = environment;
  appName: string = this.env.settings.appName;
  
  title = this.appName;
  isAuthenticated = false;

  constructor(public route: Router, private authenticationService: AuthentificationApi){
    this.isAuthenticated = this.authenticationService.getToken() != null;
  }
}
