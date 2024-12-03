import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationApi } from "src/app/Services/AuthentificationApi.service";

@Component({
    templateUrl: './Pricing.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PricingView {
  isSidebarOpen = false;
  isAuth = false;

  constructor(private authenticationApi: AuthentificationApi,
    public router: Router){
      this.isAuth = this.authenticationApi.isAuthenticated();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}