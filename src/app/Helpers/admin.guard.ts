import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from '../Shared/Services/Toastr.service';
import { UserStore } from '../Store/user/user.store';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard {
    readonly userStore = inject(UserStore);

    constructor(
        private router: Router,
        private toastrService: ToastrService
    ) { }

    canActivate(): boolean {
        const user = this.userStore.user();
        if (user && user.roles && user.roles.some(r => r.name === 'Admin')) {
            return true;
        }

        this.toastrService.warning("Accès refusé", "Vous ne possédez pas les droits nécéssaires pour accéder à cette page");
        this.router.navigate(['/dashboard']);
        return false;
    }
}
