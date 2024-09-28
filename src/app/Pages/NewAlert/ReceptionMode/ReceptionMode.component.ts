import { Component } from "@angular/core";

export enum Frequence {
    A = "Temps réél -- Fréquence conseillée pour les alertes précises",
    B = "4 fois/jour",
    C = "2 fois/jour",
    D = "1 fois/jour -- Fréquence conseillée pour des alertes plus globales",
    E = "1 fois/3 jours",
    F = "1 fois/semaine"
}

@Component({
    selector: "app-reception-mode",
    templateUrl: './ReceptionMode.component.html',
    styleUrls: ['./ReceptionMode.component.css'],
})
export class ReceptionModeComponent {
    public frequences = Frequence;
    selectedFrequence?: Frequence;
}