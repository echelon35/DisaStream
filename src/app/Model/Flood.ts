import { Geometry } from "geojson";
import { Disaster, IDisaster } from "./Disaster";
import { DisasterFromAlertDtoFlood } from "../DTO/DisasterFromAlertDto";

export interface IFlood extends IDisaster {
    surface: Geometry;
}

export class Flood extends Disaster {
    surface: Geometry;
    frenchType = 'Inondation';
    pictureType = '/assets/images/markers/flood.svg';
    type = 'flood';

    constructor(obj: DisasterFromAlertDtoFlood) {
        super(obj);
        if(obj){
            this.surface = obj.surface;
        }
    }
}