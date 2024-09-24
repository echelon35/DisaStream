
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-not-logged-header',
    templateUrl: './NotLoggedHeader.component.html',
    styleUrls: ['./NotLoggedHeader.component.css']
})
export class NotLoggedHeader implements OnInit {

    env = environment;
    appName: string = this.env.settings.appName;
    
    @Input() isLandingPage: boolean = false;

    constructor() { 
    }

    ngOnInit(): void {
    }

}