# Disastream

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.0.

## Features

### Alert Management

Disastream allows users to create customized alerts for various types of natural disasters (aléas). Users can:

- Select one or more types of aléas to monitor (earthquakes, floods, hurricanes, eruptions, etc.)
- Define geographical areas to monitor (custom polygons or entire countries)
- Set up team members to receive email notifications
- **Configure alea-specific criteria** to fine-tune alert conditions

#### Alea-Specific Criteria

When creating or editing an alert, you can specify criteria that are specific to the selected aléa type. This allows you to filter alerts based on disaster characteristics.

**Supported Criteria:**

- **Earthquake (Séisme)**: 
  - Magnitude filtering: Set a threshold for earthquake magnitude (e.g., magnitude > 5.0)
  - Operators: `>` (greater than), `>=` (greater than or equal), `<` (less than), `<=` (less than or equal)

- **Flood (Inondation)**:
  - Level filtering: Set a threshold for flood level (placeholder for future implementation)
  - Operators: `>`, `>=`, `<`, `<=`

**Example**: Create an alert that only triggers for earthquakes with magnitude greater than 5.0 in a specific region.

**Data Model**: Alert criteria are stored as JSON-compatible data structures, making it easy to extend with new criteria types in the future. The criteria field is optional, ensuring backward compatibility with existing alerts.

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
