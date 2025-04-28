import { Point } from "geojson";
import { Source } from "./Source";

export interface IDisaster {
    id: number;
    premier_releve: Date;
    dernier_releve: Date;
    point: Point;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    iso: string;
    country: string;
    city: string;
    cityDistance: number;
}

export class Disaster implements IDisaster {
    id: number;
    premier_releve: Date;
    dernier_releve: Date;
    point: Point;
    createdAt: Date;
    updatedAt: Date;

    source: Source;

    iso: string;
    country: string;
    city: string;
    cityDistance: number;

    type: string;
    power: string;
    frenchType: string;
    pictureType: string;
    title: string;

    constructor(obj?: IDisaster) {
        if(obj) {
            Object.assign(this, obj);
        }
    }

    get distanceText(): string {
        if(this.cityDistance < 1000){
            return this.cityDistance.toFixed(1) + ' km';
        } else {
            return (this.cityDistance / 1000).toFixed(1) + ' km';
        }
    }

    get countryPicture(): string {
        return `https://flagcdn.com/${this.iso.toLowerCase()}.svg`;
    }
}