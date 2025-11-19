# Alea-Specific Alert Criteria Feature

## Overview

This feature allows users to create alerts with specific criteria based on the type of aléa (hazard) they are monitoring. For example, users can now create an alert that only triggers for earthquakes with a magnitude greater than 5.0.

## Implementation Details

### Data Model

The implementation uses a flexible, extensible data model based on discriminated unions:

```typescript
// Base criteria structure
interface BaseAleaCriteria {
  type: string;
}

// Numeric filter for comparisons
interface NumericFilter {
  operator: 'gt' | 'gte' | 'lt' | 'lte';  // >, >=, <, <=
  value: number;
}

// Earthquake-specific criteria
interface EarthquakeCriteria extends BaseAleaCriteria {
  type: 'earthquake';
  magnitude?: NumericFilter;
  depth?: NumericFilter;
}

// Flood-specific criteria (placeholder for future)
interface FloodCriteria extends BaseAleaCriteria {
  type: 'flood';
  level?: NumericFilter;
}

// Union type for all criteria
type AleaCriteriaType = EarthquakeCriteria | FloodCriteria;
```

### Alert Model Extension

The Alert model has been extended to include an optional `criteria` field:

```typescript
export class Alert {
    id: number;
    name: string;
    aleas: Alea[];
    areas?: Geometry | null;
    mailAlerts: MailAlert[];
    isCountryShape: boolean;
    createdAt: Date;
    updatedAt: Date;
    countryId: number | null;
    isActivate: boolean;
    criteria?: AleaCriteriaType[];  // NEW: Optional criteria array
}
```

### Example Alert with Criteria

```json
{
  "id": 1,
  "name": "High Magnitude Earthquakes in California",
  "aleas": [
    { "id": 1, "name": "seisme", "label": "Séisme" }
  ],
  "areas": { /* GeoJSON geometry */ },
  "mailAlerts": [
    { "id": 1, "mail": "user@example.com" }
  ],
  "criteria": [
    {
      "type": "earthquake",
      "magnitude": {
        "operator": "gt",
        "value": 5.0
      }
    }
  ]
}
```

## User Interface

### Alert Creation Flow

1. **Select Aléa Type(s)**: User selects one or more aléa types to monitor (e.g., Séisme, Inondation)

2. **Configure Criteria (Optional)**: After selecting aléas, a new section appears allowing users to set specific criteria

3. **For Earthquakes**:
   - Magnitude filter with operator dropdown (>, >=, <, <=)
   - Numeric input for magnitude value (0-10 range)
   - Clear button to remove the filter

4. **For Floods** (Placeholder):
   - Level filter with operator dropdown
   - Numeric input for level value
   - Clear button to remove the filter

### UI Components

#### AleaCriteriaInputComponent

New component that:
- Automatically detects selected aléas
- Displays appropriate criteria inputs based on aléa type
- Validates numeric inputs
- Emits criteria changes to parent component
- Only includes criteria with defined filters in the output

## Backend Considerations

### API Expectations

The frontend now sends the `criteria` field as part of the alert object when creating or updating alerts:

```http
POST /alert/create
Content-Type: application/json

{
  "name": "My Alert",
  "aleas": [...],
  "areas": {...},
  "mailAlerts": [...],
  "criteria": [
    {
      "type": "earthquake",
      "magnitude": {
        "operator": "gt",
        "value": 5.0
      }
    }
  ]
}
```

### Alert Matching Logic (Backend Implementation Needed)

The backend should:

1. **Load Alert Criteria**: When loading alerts from the database, parse the criteria JSON
2. **Event Evaluation**: When a new disaster event occurs, evaluate it against all active alerts
3. **Criteria Matching**: For each alert with criteria:
   ```typescript
   function matchesAlert(event: Disaster, alert: Alert): boolean {
     // Check if event matches alert's aléa type and geographic area
     if (!matchesBasicCriteria(event, alert)) return false;
     
     // If no criteria, match any event of this type
     if (!alert.criteria || alert.criteria.length === 0) return true;
     
     // Check alea-specific criteria
     for (const criteria of alert.criteria) {
       if (criteria.type === 'earthquake' && event.type === 'earthquake') {
         if (criteria.magnitude) {
           if (!matchesNumericFilter(event.magnitude, criteria.magnitude)) {
             return false;
           }
         }
       }
       // ... other alea types
     }
     
     return true;
   }
   ```

## Backward Compatibility

The implementation is fully backward compatible:

- The `criteria` field is optional
- Alerts without criteria will continue to work as before (matching all events of the selected aléa types)
- Existing alerts in the database won't break

## Testing

Unit tests have been added to verify:
- Operator label generation
- Numeric filter validation
- Filter matching logic for all operators (>, >=, <, <=)
- Earthquake criteria matching
- Flood criteria matching
- Handling of undefined/missing filters

Run tests with: `npm test`

## Future Extensions

The criteria system is designed to be easily extensible:

1. **Add new aléa types**: Create a new interface extending `BaseAleaCriteria`
2. **Add new filter types**: Add the new interface to the `AleaCriteriaType` union
3. **Update UI**: Add corresponding input fields in `AleaCriteriaInputComponent`
4. **Update backend**: Add matching logic for the new criteria type

### Example: Adding Hurricane Criteria

```typescript
interface HurricaneCriteria extends BaseAleaCriteria {
  type: 'hurricane';
  windSpeed?: NumericFilter;
  category?: NumericFilter;
}

// Add to union type
type AleaCriteriaType = EarthquakeCriteria | FloodCriteria | HurricaneCriteria;
```

## Files Modified

- `src/app/Model/AleaCriteria.ts` - New criteria model
- `src/app/Model/Alert.ts` - Extended with criteria field
- `src/app/Pages/NewAlert/AleaCriteriaInput/*` - New UI component
- `src/app/Pages/NewAlert/NewAlert.component.ts` - Integrated criteria handling
- `src/app/Pages/NewAlert/NewAlert.component.html` - Added criteria UI section
- `src/app/app.module.ts` - Registered new component
- `README.md` - Documented the feature
