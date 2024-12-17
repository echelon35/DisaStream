import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthentificationApi } from './Services/AuthentificationApi.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './Model/User';
import { selectIsAuthenticated, selectUser } from './Store/Selectors/user.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class App {

  env = environment;
  appName: string = this.env.settings.appName;

  userAvatarUrl: string | null = null;
  firstname: string | null = null;
  lastname: string | null = null;
  username: string | null = null;

  user$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  
  title = this.appName;

  isSidebarOpen = false;

  constructor(public route: Router, private authenticationService: AuthentificationApi, private store: Store){
    this.user$ = this.store.select(selectUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isAuthenticated$.subscribe(isAuth => {
      if(isAuth){
        this.authenticationService.checkExpiration().subscribe(
          (val) => { 
            if(val){
              console.log('Token valide')
            }
          },
          (err) => {
            if(err.status === 401){
              this.authenticationService.logOutExpires();
            }
          }
        )
      }
    })
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
