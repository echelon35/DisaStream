
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-logged-header',
    templateUrl: './LoggedHeader.component.html',
    styleUrls: ['./LoggedHeader.component.css']
})
export class LoggedHeader implements OnInit {

    env = environment;
    userAvatarUrl: string | null = null;
    firstname: string | null = null;
    lastname: string | null = null;
    appName: string = this.env.settings.appName;

    constructor(public router: Router){}

    ngOnInit() {
        this.userAvatarUrl = localStorage.getItem('avatarUrl');
        this.firstname = localStorage.getItem('firstname');
        this.lastname = localStorage.getItem('lastname');
    }

}