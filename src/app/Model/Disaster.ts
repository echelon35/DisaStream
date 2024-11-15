import { Point } from "geojson";

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