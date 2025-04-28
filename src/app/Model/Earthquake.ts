import { Disaster, IDisaster } from "./Disaster";

export interface IEarthquake extends IDisaster {
    magnitude: number;
}

export class Earthquake extends Disaster implements IEarthquake {
    magnitude: number;
    power: string;
    frenchType = 'Séisme';
    pictureType = '/assets/images/markers/min-earthquake.svg';
    type = 'earthquake';

    constructor(obj: IEarthquake){
        super(obj);
        if(obj){
            this.magnitude = obj.magnitude;
            this.power = 'M' + this.magnitude.toString();
            this.title = 'Séisme ' + this.power + ' à ' + this.city + ' (' + this.country + ')';
        }
    }

}