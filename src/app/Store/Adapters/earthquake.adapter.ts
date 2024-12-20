import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Earthquake } from "src/app/Model/Earthquake";

export interface EarthquakeState extends EntityState<Earthquake> {
    error: string | null;
}
  
export const earthquakeAdapter: EntityAdapter<Earthquake> = createEntityAdapter<Earthquake>();

export const initialEarthquakeState: EarthquakeState = earthquakeAdapter.getInitialState({
    error: null
});