import { Disaster } from "../Model/Disaster";

export class HistoryDisaster {
    disasterId: number;
    location: string;
    type: string;
    city: string;
    country: string;
    iso: string;
    distance: number;
    disaster: Disaster;

    constructor(obj) {
        Object.assign(this, obj);
    }

    get frenchType(): string {
        switch(this.type){
            case 'earthquake':
                return 'seisme';
            case 'flood':
                return 'inondation';
            case 'hurricane':
                return 'cyclone';
            default: 
                return '';
        }
    }

    get pictureType(): string {
        switch(this.type){
            case 'earthquake':
                return '/assets/images/markers/min-earthquake.svg';
            case 'flood':
                return '/assets/images/markers/flood.svg';
            case 'hurricane':
                return '/assets/images/markers/hurricane.svg';
            default: 
                return '';
        }
    }

}