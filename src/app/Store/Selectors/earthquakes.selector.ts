import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EarthquakeState } from '../Reducer/earthquakes.reducer';

export const selectEarthquakeState =
  createFeatureSelector<EarthquakeState>('earthquakes');

export const selectEarthquakes = createSelector(
  selectEarthquakeState,
  (state) => state.earthquakes
);

export const selectError = createSelector(
  selectEarthquakeState,
  (state) => state.error
);
