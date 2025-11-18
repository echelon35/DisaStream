import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { DisasterApiService } from 'src/app/Services/DisasterApiService';
import * as FloodsActions from '../Actions/floods.actions';
import { loadFloodsGeography } from '../Actions/floods.actions';

@Injectable()
export class FloodsEffects {

  loadFloods$ = createEffect(() => this.actions$.pipe(
    ofType(loadFloodsGeography),
    mergeMap(() => 
        this.disasterApiService.searchFloods().pipe(
            map((floods) =>
              // ensure we always pass a Flood[]: default to [] and remove any undefined entries
              FloodsActions.loadFloodsGeographySuccess({ floods: ((floods ?? []) as unknown as any[]).filter(Boolean) as any[] })
            ),
            catchError((error) =>
                of(FloodsActions.loadFloodsGeographyFailure({ error }))
            )
        )
    )
  ));

  constructor(
    private actions$: Actions,
    private disasterApiService: DisasterApiService
  ) {}
}