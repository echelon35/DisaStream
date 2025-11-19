import { Geometry } from "geojson";
import { Alea } from "./Alea";
import { MailAlert } from "./MailAlert";
import { AleaCriteria } from "./AlertCriteria";

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
    isActivate: boolean;
    // Per-alea criteria for filtering alerts (stored as JSON in DB)
    criterias?: AleaCriteria[];
}