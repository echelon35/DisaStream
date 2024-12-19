import { createAction, props } from '@ngrx/store';
import { Flood } from 'src/app/Model/Flood';

export const loadFloodsGeography = createAction(
  '[Flood API] Load Floods for map'
);

export const loadFloodsGeographySuccess = createAction(
  '[Flood API] Floods Successfully loaded for map',
  props<{ floods: Flood[] }>()
);

export const loadFloodsGeographyFailure = createAction(
  '[Flood API] Load Floods Failure for map',
  props<{ error: any }>()
);
