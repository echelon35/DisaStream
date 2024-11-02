
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Model/User';
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
  registerForm: FormGroup;
  errorMessage = '';

  constructor(private route: Router,
    private seoService: SeoService, 
    private authentificationApi: AuthentificationApi, 
    private toastrService: ToastrService, 
    private fb: FormBuilder) { 
    this.seoService.generateTags("S'authentifier sur SatellEarth","Inscrivez-vous sur SatellEarth pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      allowMarketing: [false],
    });
  }

  authenticate(): void {
    this.authentificationApi.googleLogin();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authentificationApi.register(this.registerForm.value).subscribe({
      next: (user: User) => {
        // redirection ou message de succès
        this.route.navigateByUrl('/');
        this.toastrService.success(`Inscription réalisée avec succès. Un mail de confirmation vient de vous être envoyé à ${user.mail}.`);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur inconnue';
      },
    });
  }

}