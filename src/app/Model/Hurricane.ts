import { Geometry } from "geojson";
import { Disaster, IDisaster } from "./Disaster";

export interface IHurricane extends IDisaster {
    surface: Geometry;
    name: string;
    forecast: Geometry;
    path: Geometry;
}

export class Hurricane extends Disaster {
    surface: Geometry;
    forecast: Geometry;
    path: Geometry;
    name: string;

    constructor(){
        super();
        this.type = 'hurricane';
    }

    copyInto(obj: IHurricane){
        super.copyInto(obj);
        this.surface = obj.surface;
        this.forecast = obj.forecast;
        this.name = obj.name;
        this.path = obj.path;
    }
}