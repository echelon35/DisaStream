import { createReducer, on } from '@ngrx/store';
import * as HurricaneActions from '../Actions/hurricanes.actions';
import { Hurricane } from 'src/app/Model/Hurricane';

export interface HurricaneState {
  hurricanes: Hurricane[];
  error: any;
}

export const initialState: HurricaneState = {
  hurricanes: [],
  error: null,
};

export const hurricaneReducer = createReducer(
  initialState,
  on(HurricaneActions.loadHurricanesGeography, (state) => ({
    ...state,
    error: null,
  })),
  on(HurricaneActions.loadHurricanesGeographySuccess, (state, { hurricanes }) => ({
    ...state,
    hurricanes,
  })),
  on(HurricaneActions.loadHurricanesGeographyFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
