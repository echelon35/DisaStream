import { Geometry } from "geojson";
import { Alea } from "./Alea";

export class Alert {
    name = "";
    aleas: Alea[] = [];
    areas?: Geometry;
}