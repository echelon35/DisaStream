import { Disaster, IDisaster } from "./Disaster";

export interface IEarthquake extends IDisaster {
    magnitude: number;
}

export class Earthquake extends Disaster implements IEarthquake {
    magnitude = 0;
    
    copyInto(obj: IEarthquake){
        super.copyInto(obj)
        this.magnitude = obj.magnitude;
    }
}