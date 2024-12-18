import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { DisasterApiService } from 'src/app/Services/DisasterApiService';
import { loadEarthquakesGeography } from '../Actions/earthquakes.actions';
import * as EarthquakeActions from '../Actions/earthquakes.actions';

@Injectable()
export class EarthquakesEffects {

  loadEarthquakes$ = createEffect(() => this.actions$.pipe(
    ofType(loadEarthquakesGeography),
    mergeMap(() => 
        this.disasterApiService.searchEarthquakes().pipe(
            map((earthquakes) =>
                EarthquakeActions.loadEarthquakesGeographySuccess({ earthquakes })
            ),
            catchError((error) =>
                of(EarthquakeActions.loadEarthquakesGeographyFailure({ error }))
            )
        )
    )
  ));

  constructor(
    private actions$: Actions,
    private disasterApiService: DisasterApiService
  ) {}
}