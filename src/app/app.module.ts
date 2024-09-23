import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageView } from './Pages/LandingPage/LandingPage.view';
import { SeoService } from './Services/Seo.service';
import { AuthenticationView } from './Pages/Authentification/Authentification.view';
import { ForgotPasswordView } from './Pages/ForgotPassword/ForgotPassword.view';
import { AuthentificationApi } from './Services/AuthentificationApi.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './Helpers/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginView } from './Pages/Login/Login.view';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageView,
    AuthenticationView,
    LoginView,
    ForgotPasswordView
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [SeoService, 
    AuthentificationApi,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
