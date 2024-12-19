import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EruptionState } from '../Reducer/eruptions.reducer';

export const selectEruptionState =
  createFeatureSelector<EruptionState>('eruptions');

export const selectEruptions = createSelector(
  selectEruptionState,
  (state) => state.eruptions
);

export const selectError = createSelector(
  selectEruptionState,
  (state) => state.error
);
