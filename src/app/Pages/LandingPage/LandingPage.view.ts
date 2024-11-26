import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { UserApiService } from 'src/app/Services/UserApiService';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';

@Component({
  templateUrl: './LandingPage.view.html',
  styleUrls: ['./LandingPage.view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageView {
  title = 'Connectez-vous aux forces de la nature avec Disastream';
  isAuth = false;

  constructor(private route: ActivatedRoute,
    public router: Router, private authenticationApi: AuthentificationApi, private userApiService: UserApiService, private toastrService: ToastrService){
    const token = this.route.snapshot.queryParamMap.get('access_token');
    const mail = this.route.snapshot.queryParamMap.get('mail');
    this.isAuth = this.authenticationApi.isAuthenticated();
    if(token){
      this.authenticationApi.saveToken(token);
      this.userApiService.getSummaryInfos().subscribe((a) => {
        authenticationApi.saveSummary(a.avatar,a.firstname, a.lastname, a.username);
        this.router.navigate(['/dashboard/alerts/manage']).then(() => {
          window.location.reload();
        });
      })
    }
    else if(mail){
      this.toastrService.success(`Inscription réalisée avec succès.`,`Un mail de confirmation vient de vous être envoyé à <b>${mail}</b>.`);
    }
  }
}