import { Geometry } from "geojson";
import { Alea } from "./Alea";
import { MailAlert } from "./MailAlert";

export class Alert {
    id: number;
    name = "";
    aleas: Alea[] = [];
    areas?: Geometry | null;
    mailAlerts: MailAlert[] = [];
    isCountryShape = false;
    createdAt: Date;
    updatedAt: Date;
    countryId: number | null;
}