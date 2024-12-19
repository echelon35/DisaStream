import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectIsAuthenticated } from "src/app/Store/Selectors/user.selector";

@Component({
    templateUrl: './Pricing.view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PricingView {
  isSidebarOpen = false;
  isAuth = false;
  isAuthenticated$: Observable<boolean>;

  constructor(public router: Router, private store: Store){
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}