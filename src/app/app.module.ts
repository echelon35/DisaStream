import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { LandingPageView } from './Pages/LandingPage/LandingPage.view';
import { SeoService } from './Services/Seo.service';
import { AuthenticationView } from './Pages/Authentification/Authentification.view';
import { ForgotPasswordView } from './Pages/ForgotPassword/ForgotPassword.view';
import { AuthentificationApi } from './Services/AuthentificationApi.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './Helpers/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginView } from './Pages/Login/Login.view';
import { DashboardView } from './Pages/Dashboard/Dashboard.view';
import { SharedModule } from './Shared/Shared.module';
import { NewAreaView } from './Pages/NewArea/NewArea.component';
import { MapModule } from './Map/map.module';
import { ModalsModule } from './Modals/modals.module';

@NgModule({
  declarations: [
    App,
    LandingPageView,
    AuthenticationView,
    LoginView,
    ForgotPasswordView,
    DashboardView,
    NewAreaView
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MapModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalsModule
  ],
  providers: [SeoService, 
    AuthentificationApi,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [App]
})
export class AppModule { }
