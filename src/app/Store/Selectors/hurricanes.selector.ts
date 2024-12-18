import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HurricaneState } from '../Reducer/hurricanes.reducer';

export const selectHurricaneState =
  createFeatureSelector<HurricaneState>('hurricanes');

export const selectHurricanes = createSelector(
  selectHurricaneState,
  (state) => state.hurricanes
);

export const selectError = createSelector(
  selectHurricaneState,
  (state) => state.error
);
