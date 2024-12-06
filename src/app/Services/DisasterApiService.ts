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

    searchEruptions(){
      return this.apollo.watchQuery<any>({
          query: gql`
            {
              eruptions {
                id,
                point,
                surface
              }
            }
          `
        }).valueChanges;
    }

    searchHurricanes(){
      return this.apollo.watchQuery<any>({
          query: gql`
            {
              hurricanes {
                id,
                point,
                surface,
                forecast,
                path,
                name
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

    searchHurricaneById(id: number){
      return this.apollo.watchQuery<any>({
          query: gql`
            {
              hurricane(id:${id}) {
                id,
                premier_releve,
                dernier_releve,
                source {
                  name
                }
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
                  source {
                    name
                  },
                  createdAt,
                  updatedAt
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
                magnitude,
                source {
                  name
                },
                createdAt,
                updatedAt
              }
            }
          `
      }).valueChanges;
    }

    searchEruptionById(id: number){
      return this.apollo.watchQuery<any>({
          query: gql`
            {
              eruption(id:${id}) {
                id,
                premier_releve,
                dernier_releve,
                source {
                  name
                },
                createdAt,
                updatedAt
              }
            }
          `
      }).valueChanges;
    }

}