
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { SeoService } from 'src/app/Services/Seo.service';

@Component({
  templateUrl: './Login.view.html',
  styleUrls: ['./Login.view.css']
})
export class LoginView {

  showLogin = true;
  mail = "";
  password = "";

  constructor(private seoService: SeoService, private readonly authService: AuthentificationApi, private readonly toastrService: ToastrService) { 
    this.seoService.generateTags("Se connecter sur Disastream","Inscrivez-vous sur Disastream pour consulter les données de plusieurs milliers d'aléas en temps réél","/assets/background/temperature.jpg");
  }

  showLoginDiv(show:boolean){
    this.showLogin = show;
  }

  connect(){
    const userDto = {
      mail: this.mail,
      password: this.password
    };
    console.log(userDto);
    this.authService.login(userDto).subscribe({
      next: (token: string) => { console.log(token); },
      error: (e) => { console.log(e); }
    });
  }

  googleConnect(): void {
    this.authService.googleLogin();
  }

}