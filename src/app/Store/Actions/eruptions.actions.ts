import { createAction, props } from '@ngrx/store';
import { Eruption } from 'src/app/Model/Eruption';

export const loadEruptionsGeography = createAction(
  '[Eruption API] Load Eruptions for map'
);

export const loadEruptionsGeographySuccess = createAction(
  '[Eruption API] Eruptions Successfully loaded for map',
  props<{ eruptions: Eruption[] }>()
);

export const loadEruptionsGeographyFailure = createAction(
  '[Eruption API] Load Eruptions Failure for map',
  props<{ error: any }>()
);
