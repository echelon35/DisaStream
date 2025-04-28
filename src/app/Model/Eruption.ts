import { Geometry } from "geojson";
import { Disaster, IDisaster } from "./Disaster";

export interface IEruption extends IDisaster {
    surface: Geometry;
}

export class Eruption extends Disaster implements IEruption {

    surface: Geometry;
    type = 'eruption';
    frenchType = 'Eruption volcanique';
    pictureType = '/assets/images/markers/eruption.svg';
    
    constructor(obj: IEruption){
        super(obj);
        if(obj){
            this.surface = obj.surface;
        }
    }
}