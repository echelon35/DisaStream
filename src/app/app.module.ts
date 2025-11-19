import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { LandingPageView } from './Pages/LandingPage/LandingPage.view';
import { SeoService } from './Services/Seo.service';
import { AuthenticationView } from './Pages/Authentification/Authentification.view';
import { ForgotPasswordView } from './Pages/ForgotPassword/ForgotPassword.view';
import { ChangePasswordView } from './Pages/ChangePassword/ChangePassword.view';
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
import { PricingView } from './Pages/Pricing/Pricing.view';
import { FAQView } from './Pages/FAQ/FAQ.view';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './Store/Reducer/user.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { EffectsModule } from '@ngrx/effects';
import { earthquakeReducer } from './Store/Reducer/earthquakes.reducer';
import { EarthquakesEffects } from './Store/Effects/earthquakes.effects';
import { eruptionsReducer } from './Store/Reducer/eruptions.reducer';
import { EruptionsEffects } from './Store/Effects/eruptions.effects';
import { floodsReducer } from './Store/Reducer/floods.reducer';
import { FloodsEffects } from './Store/Effects/floods.effects';
import { hurricaneReducer } from './Store/Reducer/hurricanes.reducer';
import { HurricanesEffects } from './Store/Effects/hurricanes.effects';
import { DetailAlertComponent } from './Pages/DisasterView/DetailAlert/DetailAlert.component';
import { AlertCriteriasComponent } from './Pages/NewAlert/AlertCriterias/AlertCriterias.component';

export function localStorageSyncReducer(reducer: any): any {
    return localStorageSync({keys: ['user'], rehydrate: true })(reducer);
}

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
        PricingView,
        FAQView,
        ConfirmAssociationView,
        ChangePasswordView,
        DetailAlertComponent,
        AlertCriteriasComponent
    ],
    bootstrap: [App], 
    imports: [BrowserModule,
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
        GraphQLModule,
        StoreModule.forRoot({
            user: userReducer,
            earthquakes: earthquakeReducer,
            eruptions: eruptionsReducer,
            floods: floodsReducer,
            hurricanes: hurricaneReducer,
        },{ metaReducers: [localStorageSyncReducer] }),
        EffectsModule.forRoot([EarthquakesEffects, EruptionsEffects, FloodsEffects, HurricanesEffects])], 
    providers: [SeoService,
        AuthentificationApi,
        ToastrService,
        PublicApiService,
        DisasterApiService,
        StripeService,
        MarkerService,
        ShapeService,
        provideCharts(withDefaultRegisterables()), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
