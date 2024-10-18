
import { Component } from '@angular/core';
import { SeoService } from 'src/app/Services/Seo.service';

@Component({
  templateUrl: './Login.view.html',
  styleUrls: ['./Login.view.css']
})
export class LoginView {

  showLogin = true;

  constructor(private seoService: SeoService) { 
    this.seoService.generateTags("Se connecter sur Disastream","Inscrivez-vous sur Disastream pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
  }

  showLoginDiv(show:boolean){
    this.showLogin = show;
  }

}