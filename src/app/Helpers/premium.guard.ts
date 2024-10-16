import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationApi } from '../Services/AuthentificationApi.service';

@Injectable({ providedIn: 'root' })
export class IsUserPremium  {
    constructor(
        private router: Router,
        private authService: AuthentificationApi,
        private toastrService: ToastrService
    ) {}

    canActivate(): boolean {

        return true;
    }
}