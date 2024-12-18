import { createReducer, on } from '@ngrx/store';
import * as FloodsActions from '../Actions/floods.actions';
import { Flood } from 'src/app/Model/Flood';

export interface FloodState {
  floods: Flood[];
  error: any;
}

export const initialState: FloodState = {
  floods: [],
  error: null,
};

export const floodsReducer = createReducer(
  initialState,
  on(FloodsActions.loadFloodsGeography, (state) => ({
    ...state,
    error: null,
  })),
  on(FloodsActions.loadFloodsGeographySuccess, (state, { floods }) => ({
    ...state,
    floods,
  })),
  on(FloodsActions.loadFloodsGeographyFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
