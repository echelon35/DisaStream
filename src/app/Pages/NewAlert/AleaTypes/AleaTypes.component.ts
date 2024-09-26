import { Component } from "@angular/core";
import { Alea } from "src/app/Model/Alea";
import { AleaCategory } from "src/app/Model/AleaCategory";

@Component({
    selector: "app-alea-types",
    templateUrl: './AleaTypes.component.html',
    styleUrls: ['./AleaTypes.component.css'],
})
export class AleaTypesComponent {
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
    public categories;
    public selectedAleaTypes: Alea[] = [];

    constructor(){
        // this.categories = this.aleaType.reduce(
        //     (result:AleaCategory, currentValue:Alea) => { 
        //         result.category = 
        //       (result[currentValue.category] = result[currentValue.category] || []).push(currentValue);
        //       return result;
        //     }, {});

        console.log(this.categories)
    }
}