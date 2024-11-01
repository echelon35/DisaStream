
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './ConfirmEmail.view.html',
  styleUrls: ['./ConfirmEmail.view.css']
})
export class ConfirmEmailView {

  env = environment;
  appName: string = this.env.settings.appName;
  message = '';
  error = '';
  token = '';
  loading = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private readonly toastrService: ToastrService,
    private authentificationApi: AuthentificationApi) { 
      const token = this.route.snapshot.queryParamMap.get('token');
      this.token = (token !== null) ? token?.toString() : '';
      this.confirm(); 
    }

  confirm(): void {
    this.authentificationApi.confirm(this.token).subscribe({
      next: () => { 
        this.loading = false;
        this.message = `Votre adresse mail a bien été validée ! Félicitations, vous pouvez dès à présent créer des alertes
  sur DisaStream !`},
      error: () => { 
        this.loading = false;
        this.error = 'Lien de confirmation invalide ou expiré.' }
    });
  }

  goLogin(): void {
    this.router.navigateByUrl('/login');
  }

  resend(): void {
    console.log(this.token)
    this.loading = true;
    this.authentificationApi.resend(this.token).subscribe({
      next: (message: string) => {
        this.loading = false;
        // redirection ou message de succès
        this.router.navigateByUrl('/');
        this.toastrService.success(message);
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error.message || 'Erreur inconnue';
        this.toastrService.error(errorMessage);
      },
    });
  }

}