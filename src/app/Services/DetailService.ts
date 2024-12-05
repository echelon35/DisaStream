import { Injectable } from "@angular/core";
import { Disaster } from "../Model/Disaster";
import { BehaviorSubject, catchError, finalize, of, tap } from "rxjs";
import { DisasterApiService } from "./DisasterApiService";

@Injectable({
    providedIn: 'root'
})
export class DetailService {
    private disasterDetailSubject = new BehaviorSubject<Disaster>(new Disaster);
    disasterDetail$ = this.disasterDetailSubject.asObservable();
    private visibleSubject = new BehaviorSubject<boolean>(false);
    visible$ = this.visibleSubject.asObservable();

  constructor(private readonly disasterApiService: DisasterApiService){
  }

  /**
   * Définit la catastrophe dont on souhaite afficher les détails.
   * @param disaster Informations sur la catastrophe
   */
  setDisasterDetail(disaster: Disaster) {

    switch(disaster.type){
      case 'flood':

      this.disasterApiService
      .searchFloodById(disaster.id)
      .pipe(
        tap(() => {
          // Le succès est traité ici
          console.log("Requête réussie.");
        }),
        catchError((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la requête :", error);
          return of(null); // Retourne un observable vide pour continuer
        }),
        finalize(() => {
          // Cela sera toujours exécuté, même en cas d'erreur
          console.log("Finalisation");
        })
      )
      .subscribe(gql => {
        console.log(gql);
        if(!gql) return;
        const fls = gql.data?.flood;
        this.disasterDetailSubject?.next(fls);        
      })
      break;

      case 'earthquake': 

      this.disasterApiService
      .searchEarthquakeById(disaster.id)
      .pipe(
        tap(() => {
          // Le succès est traité ici
          console.log("Requête réussie.");
        }),
        catchError((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la requête :", error);
          return of(null); // Retourne un observable vide pour continuer
        }),
        finalize(() => {
          // Cela sera toujours exécuté, même en cas d'erreur
          console.log("Finalisation");
        })
      )
      .subscribe(gql => {
        if(!gql) return;
        const fls = gql.data?.earthquake;
        this.disasterDetailSubject?.next(fls);        
      })
      break;

    }
  }

  show(){
    this.visibleSubject.next(true);
  }

  hide(){
    this.visibleSubject.next(false);
  }

  
}