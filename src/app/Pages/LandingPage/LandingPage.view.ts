import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { UserApiService } from 'src/app/Services/UserApiService';

@Component({
  templateUrl: './LandingPage.view.html',
  styleUrls: ['./LandingPage.view.css']
})
export class LandingPageView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';

  constructor(private route: ActivatedRoute,
    public router: Router, private authenticationApi: AuthentificationApi, private userApiService: UserApiService){
    const token = this.route.snapshot.queryParamMap.get('access_token');
    if(token){
      authenticationApi.saveToken(token);
      this.userApiService.getSummaryInfos().subscribe((a) => {
        authenticationApi.saveSummary(a.avatar,a.firstname, a.lastname, a.username);
        this.router.navigate(['/dashboard/alerts/manage']).then(() => {
          window.location.reload();
        });
      })
    }
  }
}