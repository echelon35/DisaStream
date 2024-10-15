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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginView } from './Pages/Login/Login.view';
import { DashboardView } from './Pages/Dashboard/Dashboard.view';
import { SharedModule } from './Shared/Shared.module';
import { NewAreaView } from './Pages/NewAlert/NewArea/NewArea.component';
import { MapModule } from './Map/map.module';
import { ModalsModule } from './Modals/modals.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewAlertView } from './Pages/NewAlert/NewAlert.component';
import { AlertCriteriasComponent } from './Pages/NewAlert/AlertCriterias/AlertCriterias.component';
import { CommonModule } from '@angular/common';
import { ReceptionModeComponent } from './Pages/NewAlert/ReceptionMode/ReceptionMode.component';
import { AleaTypesComponent } from './Pages/NewAlert/AleaTypes/AleaTypes.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrModule } from 'ngx-toastr';
import { PublicApiService } from './Services/PublicApi.service';

@NgModule({
  declarations: [
    App,
    LandingPageView,
    AuthenticationView,
    LoginView,
    ForgotPasswordView,
    DashboardView,
    NewAreaView,
    NewAlertView,
    AlertCriteriasComponent,
    ReceptionModeComponent,
    AleaTypesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MapModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [SeoService, 
    AuthentificationApi,
    PublicApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [App]
})
export class AppModule { }
