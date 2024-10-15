import { Component, EventEmitter, Output } from "@angular/core";
import { AleaCategoryDto } from "src/app/DTO/AleaCategory.dto";
import { Alea } from "src/app/Model/Alea";
import { PublicApiService } from "src/app/Services/PublicApi.service";

class AleaVM {
    alea: Alea;
    selected = false;

    constructor(alea: Alea){
        this.alea = alea;
    }
}

class AleaCategoryVM {
    category = "";
    aleas: AleaVM[] = [];
}

@Component({
    selector: "app-alea-types",
    templateUrl: './AleaTypes.component.html',
    styleUrls: ['./AleaTypes.component.css'],
})
export class AleaTypesComponent {
    public aleaType: Alea[] = [
        {
            name: "seisme",
            id: 1,
            label: 'Séisme',
        },
        {
            name: "cyclone",
            id: 2,
            label: 'Cyclone'
        },
        {
            name: "inondation",
            id: 3,
            label: 'Inondation'
        },
        {
            name: "eruption",
            id: 4,
            label: 'Eruption'
        },
        {
            name: "Bolide",
            id: 5,
            label: 'Bolide'
        }
    ]
    public categories: AleaCategoryVM[] = [];
    public selectedAleaTypes: Alea[] = [];
    
    @Output() aleaChange = new EventEmitter<Alea[]>();

    constructor(private readonly publicApiService: PublicApiService){
        this.getAleas();
        // this.aleaType.forEach((item: Alea) => {
        //     console.log(this.categories.find(cat => item.category == cat.category))
        //     if(!this.categories.find(cat => item.category == cat.category)){
        //         this.categories.push({
        //             category: item.category,
        //             aleas: [item]
        //         })
        //     }
        //     else{
        //         this.categories.find(cat => cat.category == item.category)?.aleas.push(item);
        //     }
        // })
    }

    getAleas(){
        this.publicApiService.getAleasByCategory().subscribe((v) => {
            const aleasByCategory: AleaCategoryVM[] = [];
            v.forEach((item) => {
              const aleaCategoryDto = item as AleaCategoryDto;
              if(!aleasByCategory.find((cat) => aleaCategoryDto.category_name == (cat as AleaCategoryVM).category)){
                aleasByCategory.push({
                      category: aleaCategoryDto.category_name,
                      aleas: [{
                        alea: {
                            id: aleaCategoryDto.alea_id,
                            name: aleaCategoryDto.alea_name,
                            label: aleaCategoryDto.alea_label,
                        },
                        selected: false,
                      }]
                  })
              }
              else{
                aleasByCategory.find((cat) => (cat as AleaCategoryVM).category == aleaCategoryDto.category_name)?.aleas.push({
                  alea: {
                  id: aleaCategoryDto.alea_id,
                  name: aleaCategoryDto.alea_name,
                  label: aleaCategoryDto.alea_label,
                },
                selected: false,
                });
              }
            })
            this.categories = aleasByCategory;
        })
    }
    
    nextStep(){
        this.selectedAleaTypes = [];
        this.categories.forEach(item => item.aleas.forEach(aleaVM => {
            if(aleaVM.selected){
                this.selectedAleaTypes.push(aleaVM.alea);
            }
        }))
        this.aleaChange.emit(this.selectedAleaTypes);
    }

    selectAlea(alea: AleaVM){
        alea.selected = !alea.selected;
    }
}