
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { SeoService } from 'src/app/Services/Seo.service';
import { ToastrService } from 'src/app/Shared/Services/toastr.service';
import { StrongPasswordRegx } from 'src/app/Utils/Const/StrongPasswordRegex';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './Authentification.view.html'
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

    //Redirect if already connected
    if(this.authentificationApi.isAuthenticated()){
      this.route.navigateByUrl('/dashboard');
    }

    this.seoService.generateTags("S'authentifier sur SatellEarth","Inscrivez-vous sur SatellEarth pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(StrongPasswordRegx)]],
      acceptTerms: [false, Validators.requiredTrue],
      allowMarketing: [false],
    });
  }

  authenticate(): void {
    this.authentificationApi.googleSignin();
  }

  get passwordFormField() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authentificationApi.register(this.registerForm.value).subscribe({
      next: (user: User) => {
        // redirection ou message de succès
        this.route.navigateByUrl(`/?mail=${user.mail}`);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur inconnue';
      },
    });
  }

}