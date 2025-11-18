import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { DisasterApiService } from 'src/app/Services/DisasterApiService';
import * as EruptionsActions from '../Actions/eruptions.actions';
import { loadEruptionsGeography } from '../Actions/eruptions.actions';
import { Eruption } from 'src/app/Model/Eruption';

@Injectable()
export class EruptionsEffects {

  loadEruptions$ = createEffect(() => this.actions$.pipe(
    ofType(loadEruptionsGeography),
    mergeMap(() => 
        this.disasterApiService.searchEruptions().pipe(
            map((eruptions) =>
              EruptionsActions.loadEruptionsGeographySuccess({ eruptions: (eruptions ?? []) as Eruption[] })
            ),
            catchError((error) =>
                of(EruptionsActions.loadEruptionsGeographyFailure({ error }))
            )
        )
    )
  ));

  constructor(
    private actions$: Actions,
    private disasterApiService: DisasterApiService
  ) {}
}