import { createReducer, on } from '@ngrx/store';
import { earthquakeAdapter, initialEarthquakeState } from '../Adapters/earthquake.adapter';
import * as EarthquakeActions from '../Actions/earthquakes.actions';

export const earthquakeReducer = createReducer(
  initialEarthquakeState,
  
  // Action pour indiquer le début du chargement
  on(EarthquakeActions.loadEarthquakesGeography, (state) => ({
    ...state,
  })),
  
  // Action pour charger les Earthquakes
  on(EarthquakeActions.loadEarthquakesGeographySuccess, (state, { earthquakes }) => 
    earthquakeAdapter.setAll(earthquakes, {
      ...state,
      error: null,
    })
  ),
  
  // Action pour gérer une erreur
  on(EarthquakeActions.loadEarthquakesGeographyFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
