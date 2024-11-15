import { Injectable } from "@angular/core";
import { Disaster } from "../Model/Disaster";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DetailService {
    private disasterDetailSubject = new BehaviorSubject<Disaster | null>(null);
    disasterDetail$ = this.disasterDetailSubject.asObservable();

  /**
   * Définit la catastrophe dont on souhaite afficher les détails.
   * @param disaster Informations sur la catastrophe
   */
  setDisasterDetail(disaster: Disaster) {
    this.disasterDetailSubject.next(disaster);
  }
}