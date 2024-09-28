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

const routes: Routes = [
  { path: '', component: LandingPageView },
  { path: 'auth', component: AuthenticationView },
  { path: 'login', component: LoginView },
  { path: 'password/reset', component: ForgotPasswordView },
  { path: '404', component: PageNotFoundView },
  { path: 'dashboard', component: DashboardView },
  { path: 'dashboard/alert/new', component: NewAlertView },
  { path: 'dashboard/alerts/manage', component: ManageAlertsView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {    
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
