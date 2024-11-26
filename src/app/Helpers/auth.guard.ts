import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationApi } from '../Services/AuthentificationApi.service';
import { ToastrService } from '../Shared/Services/Toastr.service';

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

        this.toastrService.warning("Connexion","<a href='/login'>Vous devez-être connecté pour pouvoir accéder à cette page</a>");
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth']);
        return false;
    }
}