import { Geometry } from "geojson";
import { Disaster, IDisaster } from "./Disaster";

export interface IEruption extends IDisaster {
    surface: Geometry;
}

export class Eruption extends Disaster implements IEruption {

    surface: Geometry;
    
    constructor(){
        super();
        this.type = 'eruption';
    }
    
    copyInto(obj: IEruption){
        super.copyInto(obj)
    }
}