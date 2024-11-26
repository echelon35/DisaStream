
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { ToastrService } from 'src/app/Shared/Services/toastr.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './ConfirmEmail.view.html'
})
export class ConfirmEmailView {

  env = environment;
  appName: string = this.env.settings.appName;
  message = '';
  error = '';
  errorMessage = '';
  token = '';
  loading = true;
  resendForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private readonly toastrService: ToastrService,
    private authentificationApi: AuthentificationApi) { 
      const token = this.route.snapshot.queryParamMap.get('token');
      this.token = (token !== null) ? token?.toString() : '';
      this.confirm(); 
      this.resendForm = this.fb.group({
        mail: ['', [Validators.required, Validators.email]],
      });
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

  get mailFormField() {
    return this.resendForm.get('mail');
  }

  resend(): void {
    if (this.resendForm.invalid) return;
    this.loading = true;
    const mail = this.resendForm.controls['mail'].value;
    this.authentificationApi.resend(mail).subscribe({
      next: (message: string) => {
        this.loading = false;
        // redirection ou message de succès
        this.router.navigateByUrl('/');
        this.toastrService.success('Email envoyé',`Un nouvel email de confirmation vient d'être envoyé à <b>${mail}</b>`);
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error.message || 'Erreur inconnue';
        this.toastrService.error(errorMessage);
      },
    });
  }

}