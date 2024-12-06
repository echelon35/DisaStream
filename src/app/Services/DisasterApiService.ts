import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";

@Injectable({
    providedIn: 'root'
})
export class DisasterApiService {

    constructor(private readonly apollo: Apollo){

    }

    searchEarthquakes(){
        return this.apollo.watchQuery<any>({
            query: gql`
              {
                earthquakes {
                  id,
                  point
                }
              }
            `
          }).valueChanges;
    }

    searchFloods(){
        return this.apollo.watchQuery<any>({
            query: gql`
              {
                floods {
                  id,
                  premier_releve,
                  dernier_releve,
                  point,
                  surface
                }
              }
            `
          }).valueChanges;
    }

    searchFloodById(id: number){
        return this.apollo.watchQuery<any>({
            query: gql`
              {
                flood(id:${id}) {
                  id,
                  premier_releve,
                  dernier_releve,
                  point,
                  surface,
                  source {
                    name
                  }
                }
              }
            `
        }).valueChanges;
    }

    searchEarthquakeById(id: number){
      return this.apollo.watchQuery<any>({
          query: gql`
            {
              earthquake(id:${id}) {
                id,
                premier_releve,
                dernier_releve,
                point,
                magnitude,
                source {
                  name
                }
              }
            }
          `
      }).valueChanges;
  }

}