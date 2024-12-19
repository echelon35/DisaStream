import { createAction, props } from '@ngrx/store';
import { Hurricane } from 'src/app/Model/Hurricane';

export const loadHurricanesGeography = createAction(
  '[Hurricane API] Load Hurricanes for map'
);

export const loadHurricanesGeographySuccess = createAction(
  '[Hurricane API] Hurricanes Successfully loaded for map',
  props<{ hurricanes: Hurricane[] }>()
);

export const loadHurricanesGeographyFailure = createAction(
  '[Hurricane API] Load Hurricanes Failure for map',
  props<{ error: any }>()
);
