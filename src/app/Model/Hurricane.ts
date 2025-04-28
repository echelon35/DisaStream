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
    frenchType = 'Cyclone';
    pictureType = '/assets/images/markers/hurricane.svg';
    type = 'hurricane';

    constructor(obj: IHurricane){
        super(obj);
        if(obj) {
            this.surface = obj.surface;
            this.forecast = obj.forecast;
            this.name = obj.name;
            this.path = obj.path;
            this.title = 'Cyclone ' + this.name;
        }
    }
}