# Disastream

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.0.

## Features

### Per-Alea Alert Criteria

Disastream supports configuring custom criteria for alerts based on the type of natural hazard (alea). This allows users to receive notifications only when specific conditions are met.

#### Earthquake Criteria

When creating or editing an alert that includes earthquakes, you can set optional filters:

- **Magnitude**: Filter earthquakes by magnitude (e.g., only alert when magnitude > 5.0)
  - Operators: `>`, `>=`, `<`, `<=`
  - Value: Decimal number (e.g., 5.0, 6.5)
  
- **Nombre de ressentis** (Report count): Filter by the number of people who reported feeling the earthquake
  - Operators: `>`, `>=`, `<`, `<=`
  - Value: Integer (e.g., 100, 500)
  
- **Source**: Filter by earthquake data source
  - Operators: `Égal à` (equals), `Contient` (contains)
  - Value: Text string (e.g., "USGS", "EMSC")

#### How to Use

1. Navigate to the "New Alert" page
2. Give your alert a name
3. Optionally define a geographic area to monitor
4. Select "Séisme" (Earthquake) as one of the hazard types to monitor
5. In the "Critères optionnels" section, check the criteria you want to apply
6. Configure the operator and value for each criterion
7. Add team members to notify
8. Create the alert

The criteria are optional - if not specified, all earthquakes in the selected area will trigger the alert.

#### Technical Details

Criteria are stored as JSON in the `criterias` column of the `alerts` table with the following schema:

```typescript
{
  type: 'earthquake',
  filters: {
    magnitude?: { op: 'gt'|'gte'|'lt'|'lte', value: number },
    nb_ressenti?: { op: 'gt'|'gte'|'lt'|'lte', value: number },
    lien_source?: { op: 'eq'|'contains', value: string }
  }
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
