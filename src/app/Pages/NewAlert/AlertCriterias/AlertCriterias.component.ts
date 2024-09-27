import { Component } from "@angular/core";
import { Alea } from "src/app/Model/Alea";
import { AlertCriteria, Criteria, CriteriaType } from "src/app/Model/AlertCriteria";


@Component({
    selector: "app-alert-criterias",
    templateUrl: './AlertCriterias.component.html',
    styleUrls: ['./AlertCriterias.component.css'],
})
export class AlertCriteriasComponent {
    public aleaType: Alea[] = [];
    public operations = CriteriaType;
    
    public AlertCriteriaVMList: AlertCriteriaVM[] = [];

    //Mock an alert criteria edition
    alertCriteriaFromDb: AlertCriteria[] = [
        {
            criteria: {
                name: "intensite",
                label: "Intensité",
                alea: {
                    name: "seisme",
                    disponible: true,
                    legend: "",
                    category: "tectonique"
                }
            },
            criteriaType: CriteriaType.EQUAL,
            value: "5"
        }
    ]

    //Mock aleas from db with criterias
    aleasFromDb = [
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

    //Mock criterias from db associated with alea selected
    criteriasFromDb = [
        {
            alea: this.aleasFromDb[0],
            name: "intensite",
            label: "Intensité"
        },
        {
            alea: this.aleasFromDb[0],
            name: "magnitude",
            label: "Magnitude"
        },
        {
            alea: this.aleasFromDb[1],
            name: "force",
            label: "Force"
        }
    ];
    
    constructor(){
        this.AlertCriteriaVMList = this.alertCriteriaFromDb.map((item: AlertCriteria):AlertCriteriaVM => { return {
            selectedAlea: item.criteria.alea,
            selectedCriteria: item.criteria,
            selectedOperator: item.criteriaType,
            criteriaList: this.criteriasFromDb.filter(cr => cr.alea.name == item.criteria.alea.name),
            typedValue: item.value
        } });
        this.feedAleaCriteriaList();
    }

    /**
     * Get alea with criterias
     */
    feedAleaCriteriaList(): void{
        this.aleaType = this.aleasFromDb.filter( a => this.criteriasFromDb.some( b => a === b.alea ) );
    }

    /**
     * Get only the criterias associated with alea
     */
    feedCriteriaList(index: number): void{
        this.AlertCriteriaVMList[index].criteriaList = this.criteriasFromDb.filter(item => item.alea == this.AlertCriteriaVMList[index].selectedAlea)
    }

    public objectComparisonFunction = function( option, value ) : boolean {
        return option.name === value.name;
    }

    public operatorComparisonFunction = function( option, value ) : boolean {
        return option.key === value.key;
    }

    /**
     * Add criteria on alert
     */
    public addCriteria(): void {
        const newCriteria = new AlertCriteriaVM();
        this.AlertCriteriaVMList.push(newCriteria);
    }

    /**
     * Remove criteria from the list
     * @param index 
     */
    public removeCriteria(index: number){
        this.AlertCriteriaVMList.splice(index, 1);
    }

}

/**
 * A line of criteria
 */
export class AlertCriteriaVM {
    //Alea selected
    selectedAlea?: Alea;
    //Criteria selected
    selectedCriteria?: Criteria;
    //Criteria list
    criteriaList: Criteria[] = [];
    //Operator selected
    selectedOperator?: CriteriaType;
    //Value
    typedValue = "";

    constructor(){
        this.selectedAlea = new Alea();
        this.selectedCriteria = new Criteria();
    }

}