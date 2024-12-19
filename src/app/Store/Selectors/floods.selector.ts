import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FloodState } from '../Reducer/floods.reducer';

export const selectFloodState =
  createFeatureSelector<FloodState>('floods');

export const selectFloods = createSelector(
  selectFloodState,
  (state) => state.floods
);

export const selectError = createSelector(
  selectFloodState,
  (state) => state.error
);
