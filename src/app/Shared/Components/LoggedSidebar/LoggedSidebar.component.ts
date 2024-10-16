
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-logged-sidebar',
    templateUrl: './LoggedSidebar.component.html',
    styleUrls: ['./LoggedSidebar.component.css']
})
export class LoggedSidebar implements OnInit {

  userAvatarUrl: string | null = null;

  ngOnInit(): void {
    this.userAvatarUrl = localStorage.getItem('avatarUrl');
  }

}