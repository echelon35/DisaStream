import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LandingPageView } from './Pages/LandingPage/LandingPage.view';
import { AuthenticationView } from './Pages/Authentification/Authentification.view';
import { ForgotPasswordView } from './Pages/ForgotPassword/ForgotPassword.view';
import { PageNotFoundView } from './Pages/PageNotFoundView/PageNotFound.view';
import { LoginView } from './Pages/Login/Login.view';
import { DashboardView } from './Pages/Dashboard/Dashboard.view';
import { NewAlertView } from './Pages/NewAlert/NewAlert.component';
import { ManageAlertsView } from './Pages/ManageAlerts/ManageAlerts.view';
import { UserProfileComponent } from './Pages/UserProfile/user-profile.component';
import { IsUserSignedIn } from './Helpers/auth.guard';
import { FinalScreenView } from './Pages/FinalScreen/FinalScreen.component';
import { ConfirmEmailView } from './Pages/ConfirmEmail/ConfirmEmail.view';
import { ConfirmAssociationView } from './Pages/ConfirmAssociation/ConfirmAssociation.view';
import { DisasterView } from './Pages/DisasterView/disaster.view';
import { PricingView } from './Pages/Pricing/Pricing.view';
import { FAQView } from './Pages/FAQ/FAQ.view';
import { ChangePasswordView } from './Pages/ChangePassword/ChangePassword.view';

export const routes: Routes = [
  { path: '', component: LandingPageView },
  // { path: 'auth', component: AuthenticationView },
  // { path: 'login', component: LoginView },
  // { path: 'price', component: PricingView },
  // { path: 'faq', component: FAQView },
  // { path: 'forgot-password', component: ForgotPasswordView },
  // { path: 'change-password', component: ChangePasswordView },
  // { path: 'profile', component: UserProfileComponent },
  // { path: 'confirm-email', component: ConfirmEmailView },
  // { path: 'confirm-association', component: ConfirmAssociationView },
  // { path: 'dashboard', component: DashboardView, canActivate: [IsUserSignedIn] },
  // { path: 'dashboard/alert/success', component: FinalScreenView, canActivate: [IsUserSignedIn] },
  // { path: 'dashboard/alert/new', component: NewAlertView, canActivate: [IsUserSignedIn] },
  // { path: 'dashboard/alert/edit', component: NewAlertView, canActivate: [IsUserSignedIn] },
  // { path: 'dashboard/alerts/manage', component: ManageAlertsView, canActivate: [IsUserSignedIn] },
  // { path: 'dashboard/map', component: DisasterView },
  // { path: '**', pathMatch: 'full', component: PageNotFoundView },
];