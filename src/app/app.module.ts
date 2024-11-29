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
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { LoginView } from './Pages/Login/Login.view';
import { SharedModule } from './Shared/Shared.module';
import { MapModule } from './Map/map.module';
import { ModalsModule } from './Modals/modals.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewAlertView } from './Pages/NewAlert/NewAlert.component';
import { CommonModule } from '@angular/common';
import { PublicApiService } from './Services/PublicApi.service';
import { ManageAlertsView } from './Pages/ManageAlerts/ManageAlerts.view';
import { UserProfileComponent } from './Pages/UserProfile/user-profile.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ConfirmEmailView } from './Pages/ConfirmEmail/ConfirmEmail.view';
import { ConfirmAssociationView } from './Pages/ConfirmAssociation/ConfirmAssociation.view';
import { DisasterView } from './Pages/DisasterView/disaster.view';
import { DisasterApiService } from './Services/DisasterApiService';
import { MarkerService } from './Map/Services/marker.service';
import { GraphQLModule } from './graphql.module';
import { ToastrService } from './Shared/Services/Toastr.service';
import { ShapeService } from './Map/Services/shape.service';
import { PipeModule } from './PipeModule/pipe.module';
import { StripeService } from './Services/StripeService';

@NgModule({ declarations: [
        App,
        LandingPageView,
        AuthenticationView,
        LoginView,
        ForgotPasswordView,
        DisasterView,
        NewAlertView,
        ManageAlertsView,
        UserProfileComponent,
        ConfirmEmailView,
        ConfirmAssociationView,
    ],
    bootstrap: [App], imports: [BrowserModule,
        CommonModule,
        FormsModule,
        MapModule,
        PipeModule,
        SharedModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ModalsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        GraphQLModule], 
        providers: [SeoService,
        AuthentificationApi,
        ToastrService,
        PublicApiService,
        DisasterApiService,
        StripeService,
        MarkerService,
        ShapeService,
        provideCharts(withDefaultRegisterables()),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
