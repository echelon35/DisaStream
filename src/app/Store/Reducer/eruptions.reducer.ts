import { createReducer, on } from '@ngrx/store';
import * as EruptionsActions from '../Actions/eruptions.actions';
import { Eruption } from 'src/app/Model/Eruption';

export interface EruptionState {
  eruptions: Eruption[];
  error: any;
}

export const initialState: EruptionState = {
  eruptions: [],
  error: null,
};

export const eruptionsReducer = createReducer(
  initialState,
  on(EruptionsActions.loadEruptionsGeography, (state) => ({
    ...state,
    error: null,
  })),
  on(EruptionsActions.loadEruptionsGeographySuccess, (state, { eruptions }) => ({
    ...state,
    eruptions,
  })),
  on(EruptionsActions.loadEruptionsGeographyFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
