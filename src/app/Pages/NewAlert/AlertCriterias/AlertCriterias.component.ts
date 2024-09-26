import { Component } from "@angular/core";
import { Alea } from "src/app/Model/Alea";

@Component({
    selector: "app-alert-criterias",
    templateUrl: './AlertCriterias.component.html',
    styleUrls: ['./AlertCriterias.component.css'],
})
export class AlertCriteriasComponent {
    public aleaType: Alea[] = [
        {
            name: "seisme",
            disponible: true,
            legend: "",
            category: "tectonique"
        },
        {
            name: "cyclone",
            disponible: true,
            legend: "",
            category: "météo"
        },
        {
            name: "inondation",
            disponible: true,
            legend: "",
            category: "météo"
        },
        {
            name: "eruption",
            disponible: true,
            legend: "",
            category: "tectonique"
        },
        {
            name: "Bolide",
            disponible: true,
            legend: "",
            category: "spatial"
        }
    ]
    public selectedAlea = "";
    public criterias = ["Premier_releve","Dernier_releve"]
}