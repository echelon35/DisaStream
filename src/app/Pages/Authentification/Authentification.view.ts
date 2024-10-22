
import { Component } from '@angular/core';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { SeoService } from 'src/app/Services/Seo.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './Authentification.view.html',
  styleUrls: ['./Authentification.view.css']
})
export class AuthenticationView {

  showLogin = true;
  env = environment;
  appName: string = this.env.settings.appName;

  constructor(private seoService: SeoService, private authentificationApi: AuthentificationApi) { 
    this.seoService.generateTags("S'authentifier sur SatellEarth","Inscrivez-vous sur SatellEarth pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
  }

  authenticate(): void {
    this.authentificationApi.googleLogin();
  }

}