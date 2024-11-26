
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenDto } from 'src/app/DTO/token.dto';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { SeoService } from 'src/app/Services/Seo.service';
import { ToastrService } from 'src/app/Shared/Services/toastr.service';

@Component({
  templateUrl: './Login.view.html'
})
export class LoginView {

  showLogin = true;
  loginForm: FormGroup;

  constructor(private seoService: SeoService, 
    private readonly authService: AuthentificationApi, 
    private readonly toastrService: ToastrService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { 

      const error = this.route.snapshot.queryParamMap.get('error');
      if(error){
        this.toastrService.error(error);
      }

    //Redirect if already connected
    if(this.authService.isAuthenticated()){
      this.router.navigateByUrl('/dashboard');
    }
    this.seoService.generateTags("Se connecter sur Disastream","Inscrivez-vous sur Disastream pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
    this.loginForm = this.fb.group({
      password: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
    });
  }

  showLoginDiv(show:boolean){
    this.showLogin = show;
  }

  connect(){
    this.authService.login(this.loginForm.value).subscribe({
      next: (token: TokenDto) => {
        this.router.navigateByUrl('?access_token=' + token.access_token);
      },
      error: (e) => {
        console.log(e);
        this.toastrService.error(e.error.message);
      }
    });
  }

  googleConnect(): void {
    this.authService.googleLogin();
  }

}