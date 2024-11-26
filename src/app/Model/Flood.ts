import { Geometry } from "geojson";
import { Disaster, IDisaster } from "./Disaster";

export interface IFlood extends IDisaster {
    surface: Geometry;
}

export class Flood extends Disaster {
    surface: Geometry;

    copyInto(obj: IFlood){
        super.copyInto(obj);
        this.surface = obj.surface;
    }
}