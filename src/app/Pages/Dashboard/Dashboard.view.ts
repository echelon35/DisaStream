import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';

@Component({
  templateUrl: './Dashboard.view.html',
  styleUrls: ['./Dashboard.view.css']
})
export class DashboardView {
  title = 'Connectez-vous aux forces de la nature avec Cataclysm';

  constructor(private route: ActivatedRoute,
    private router: Router, private authenticationApi: AuthentificationApi){
    const token = this.route.snapshot.queryParamMap.get('access_token');
    if(token){
      authenticationApi.saveToken(token);
      this.router.navigate(['/dashboard']).then(() => {
        window.location.reload();
      });;
    }
  }
}