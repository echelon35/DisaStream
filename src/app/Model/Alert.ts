import { Geometry } from "geojson";
import { Alea } from "./Alea";
import { MailAlert } from "./MailAlert";

export class Alert {
    name = "";
    aleas: Alea[] = [];
    areas?: Geometry | null;
    mailAlerts: MailAlert[] = [];
}