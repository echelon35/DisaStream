import { createReducer, on } from '@ngrx/store';
import * as EarthquakeActions from '../Actions/earthquakes.actions';
import { Earthquake } from 'src/app/Model/Earthquake';

export interface EarthquakeState {
  earthquakes: Earthquake[];
  error: any;
}

export const initialState: EarthquakeState = {
  earthquakes: [],
  error: null,
};

export const earthquakeReducer = createReducer(
  initialState,
  on(EarthquakeActions.loadEarthquakesGeography, (state) => ({
    ...state,
    error: null,
  })),
  on(EarthquakeActions.loadEarthquakesGeographySuccess, (state, { earthquakes }) => ({
    ...state,
    earthquakes,
  })),
  on(EarthquakeActions.loadEarthquakesGeographyFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
