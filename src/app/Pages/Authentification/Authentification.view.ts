
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/Seo.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './Authentification.view.html',
  styleUrls: ['./Authentification.view.css']
})
export class AuthenticationView implements OnInit {

  showLogin = true;
  env = environment;
  appName: string = this.env.settings.appName;

  constructor(private seoService: SeoService) { 
    this.seoService.generateTags("S'authentifier sur SatellEarth","Inscrivez-vous sur SatellEarth pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
  }

  ngOnInit(): void {
  }

  showLoginDiv(show:boolean){
    this.showLogin = show;
  }

}