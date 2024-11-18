import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthentificationApi } from './Services/AuthentificationApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class App implements OnInit {

  env = environment;
  appName: string = this.env.settings.appName;

  userAvatarUrl: string | null = null;
  firstname: string | null = null;
  lastname: string | null = null;
  username: string | null = null;
  
  title = this.appName;
  isAuthenticated = false;

  isSidebarOpen = false;

  constructor(public route: Router, private authenticationService: AuthentificationApi){
    this.isAuthenticated = this.authenticationService.getToken() != null;
  }

  ngOnInit() {
    this.userAvatarUrl = localStorage.getItem('avatarUrl');
    this.firstname = localStorage.getItem('firstname');
    this.lastname = localStorage.getItem('lastname');
    this.username = localStorage.getItem('username');
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
