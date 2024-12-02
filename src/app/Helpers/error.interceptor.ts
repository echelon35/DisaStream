import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

//L'intercepteur d'erreur intercepte les réponses http de l'API pour vérifier s'il y a eu des erreurs. 
//S'il y a une réponse 401 non autorisée, l'utilisateur est automatiquement déconnecté de l'application, 
//toutes les autres erreurs sont renvoyées au service appelant afin qu'une alerte puisse être affichée à l'utilisateur.

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if(err.error){
                // const error = err.error.message || err.statusText;

                if(err.status == 404){
                    this.router.navigate(['/404']);
                }
                
                // return throwError(error);
            }

            return throwError(err);

        }))
    }

}