import { createAction, props } from '@ngrx/store';
import { Earthquake } from 'src/app/Model/Earthquake';

export const loadEarthquakesGeography = createAction(
  '[Earthquake API] Load Earthquakes for map'
);

export const loadEarthquakesGeographySuccess = createAction(
  '[Earthquake API] Earthquakes Successfully loaded for map',
  props<{ earthquakes: Earthquake[] }>()
);

export const loadEarthquakesGeographyFailure = createAction(
  '[Earthquake API] Load Earthquakes Failure for map',
  props<{ error: any }>()
);
