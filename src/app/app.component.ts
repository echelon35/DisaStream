import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  env = environment;
  appName: string = this.env.settings.appName;
  
  title = this.appName;
  isAuthenticated = false;

  constructor(public route: Router){
    console.log(route.url);
  }
}
