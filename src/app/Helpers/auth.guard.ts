import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationApi } from '../Services/AuthentificationApi.service';

@Injectable({ providedIn: 'root' })
export class IsUserSignedIn  {
    constructor(
        private router: Router,
        private authService: AuthentificationApi,
        private toastrService: ToastrService
    ) {}

    canActivate(): boolean {

        if (this.authService.getToken()) {
            // authorised so return true
            return true;
        }

        this.toastrService.info("Vous devez-être connecté pour pouvoir accéder à cette page");
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth']);
        return false;
    }
}