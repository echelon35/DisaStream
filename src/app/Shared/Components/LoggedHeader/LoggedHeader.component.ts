
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-logged-header',
    templateUrl: './LoggedHeader.component.html',
    styleUrls: ['./LoggedHeader.component.css']
})
export class LoggedHeader implements OnInit {

    env = environment;
    appName: string = this.env.settings.appName;

    constructor() { 
    }

    ngOnInit(): void {
    }

}