import { Point } from "geojson";
import { Source } from "./Source";

export interface IDisaster {
    id: number;
    premier_releve: Date;
    dernier_releve: Date;
    point: Point;
    createdAt: Date;
    updatedAt: Date;
}

export class Disaster implements IDisaster {
    id: number;
    premier_releve: Date;
    dernier_releve: Date;
    point: Point;
    createdAt: Date;
    updatedAt: Date;

    source: Source;

    type: string;
    
    copyInto(obj: IDisaster){
        if(obj){
            this.id = obj?.id;
            this.premier_releve = obj?.premier_releve;
            this.dernier_releve = obj?.dernier_releve;
            this.point = obj?.point;
            this.createdAt = obj?.createdAt;
            this.updatedAt = obj?.updatedAt;
        }
    }
}