import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './LandingPage.view.html',
  styleUrls: ['./LandingPage.view.css']
})
export class LandingPageView {
  title = 'Connectez-vous aux forces de la nature avec Cataclysm';

  constructor(public router: Router){
  }
}