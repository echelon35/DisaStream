
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/Model/User';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { SeoService } from 'src/app/Services/Seo.service';
import { Picture, RandomPictureService } from 'src/app/Shared/Services/RandomPicture.service';
import { selectIsAuthenticated } from 'src/app/Store/Selectors/user.selector';
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
  picture: Picture;
  isAuthenticated$: Observable<boolean>;

  constructor(private route: Router,
    private seoService: SeoService, 
    private randomPictureService: RandomPictureService,
    private authentificationApi: AuthentificationApi,
    private store: Store,
    private fb: FormBuilder) { 

    this.picture = this.randomPictureService.getPictureRandom();

    //Redirect if already connected
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isAuthenticated$.subscribe((isAuth) => {
      if(isAuth){
        this.route.navigateByUrl('/dashboard');
      }
    })

    this.seoService.generateTags("S'authentifier sur Disastream","Inscrivez-vous sur Disastream pour être notifiés des dernières catastrophes naturelles","https://disastream.s3.eu-west-3.amazonaws.com/background/avalanche.jpg");

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