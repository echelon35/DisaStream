
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/Seo.service';

@Component({
  templateUrl: './Login.view.html',
  styleUrls: ['./Login.view.css']
})
export class LoginView implements OnInit {

  showLogin: boolean = true;

  constructor(private seoService: SeoService) { 
    this.seoService.generateTags("Se connecter sur Cataclysm","Inscrivez-vous sur Cataclysm pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
  }

  ngOnInit(): void {
  }

  showLoginDiv(show:boolean){
    this.showLogin = show;
  }

}