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
    public categories: AleaCategory[] = [];
    public selectedAleaTypes: Alea[] = [];
    public spliceNumber = 0;

    constructor(){
        this.aleaType.forEach((item: Alea) => {
            console.log(this.categories.find(cat => item.category == cat.category))
            if(!this.categories.find(cat => item.category == cat.category)){
                this.categories.push({
                    category: item.category,
                    aleas: [item]
                })
            }
            else{
                this.categories.find(cat => cat.category == item.category)?.aleas.push(item);
            }
        })

        this.spliceNumber = Math.ceil(this.categories.length / 2);

        console.log(this.categories)
    }
}