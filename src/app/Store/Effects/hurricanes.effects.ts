import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { DisasterApiService } from 'src/app/Services/DisasterApiService';
import * as HurricanesActions from '../Actions/hurricanes.actions';
import { loadHurricanesGeography } from '../Actions/hurricanes.actions';

@Injectable()
export class HurricanesEffects {

  loadHurricanes$ = createEffect(() => this.actions$.pipe(
    ofType(loadHurricanesGeography),
    mergeMap(() => 
        this.disasterApiService.searchHurricanes().pipe(
            map((hurricanes) =>
              HurricanesActions.loadHurricanesGeographySuccess({ hurricanes })
            ),
            catchError((error) =>
                of(HurricanesActions.loadHurricanesGeographyFailure({ error }))
            )
        )
    )
  ));

  constructor(
    private actions$: Actions,
    private disasterApiService: DisasterApiService
  ) {}
}