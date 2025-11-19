# Backend Implementation Guide for Alert Criteria

This document describes the backend changes required to support per-alea alert criteria functionality. The frontend implementation is complete and awaits these backend changes.

## Overview

The alert criteria feature allows users to create alerts that only trigger when specific conditions are met for a given natural hazard type (alea). For example, users can configure alerts to only notify them when earthquake magnitude exceeds 5.0.

## Database Schema

The `alerts` table already has a `criterias` column of type JSON. This column stores an array of criteria objects, one per alea type selected in the alert.

### Criteria JSON Schema

```typescript
// Discriminated union type for extensibility
type AleaCriteria = EarthquakeCriteria | /* Future: VolcanoCriteria | FloodCriteria */;

interface EarthquakeCriteria {
  type: 'earthquake';  // Discriminator field
  filters: {
    magnitude?: NumericFilter;
    nb_ressenti?: NumericFilter;
    lien_source?: StringFilter;
  };
}

interface NumericFilter {
  op: 'gt' | 'gte' | 'lt' | 'lte';  // Greater than, >=, less than, <=
  value: number;  // Must be finite
}

interface StringFilter {
  op: 'eq' | 'contains';  // Equals or contains
  value: string;  // Non-empty string
}
```

### Example Storage

```json
[
  {
    "type": "earthquake",
    "filters": {
      "magnitude": { "op": "gt", "value": 5.0 },
      "nb_ressenti": { "op": "gte", "value": 100 },
      "lien_source": { "op": "contains", "value": "USGS" }
    }
  }
]
```

## API Endpoints

### 1. Create Alert (`POST /alert/create`)

**Request Body:**
```json
{
  "name": "Significant Earthquakes",
  "aleas": [{ "id": 1, "name": "seisme", "label": "Séisme" }],
  "areas": { /* GeoJSON geometry */ },
  "mailAlerts": [{ "id": 1, "mail": "user@example.com" }],
  "isCountryShape": false,
  "countryId": null,
  "criterias": [
    {
      "type": "earthquake",
      "filters": {
        "magnitude": { "op": "gt", "value": 5.0 }
      }
    }
  ]
}
```

**Changes Required:**
- Accept optional `criterias` field in request body
- Validate criteria structure (see validation section)
- Store `criterias` as JSON in database
- Ensure backward compatibility (alerts without criterias should work)

### 2. Update Alert (`PUT /alert/edit`)

**Request Body:** Same as create, including `id` field

**Changes Required:**
- Accept optional `criterias` field in request body
- Validate criteria structure
- Update `criterias` column in database
- Allow clearing criterias (empty array or null)

### 3. Get Alert (`GET /alert/:id`)

**Response Body:**
```json
{
  "id": 1,
  "name": "Significant Earthquakes",
  "aleas": [...],
  "areas": {...},
  "mailAlerts": [...],
  "isCountryShape": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "countryId": null,
  "isActivate": true,
  "criterias": [
    {
      "type": "earthquake",
      "filters": {
        "magnitude": { "op": "gt", "value": 5.0 }
      }
    }
  ]
}
```

**Changes Required:**
- Include `criterias` field in response
- Return empty array `[]` if no criterias defined (not null)

### 4. Get User Alerts (`GET /alert`)

**Response Body:** Array of alerts (same structure as single alert)

**Changes Required:**
- Include `criterias` field for each alert

## Validation Middleware

Create validation middleware to validate criteria structure on create/update operations.

### Validation Rules

#### General Rules:
- `criterias` field is optional
- If provided, must be an array
- Each element must be a valid criteria object
- At least one filter must be defined in `filters` object

#### Earthquake Criteria Rules:
- `type` must be `'earthquake'`
- `filters` object must contain at least one of: `magnitude`, `nb_ressenti`, or `lien_source`

#### Numeric Filter Rules (magnitude, nb_ressenti):
- `op` must be one of: `'gt'`, `'gte'`, `'lt'`, `'lte'`
- `value` must be a finite number
- For `nb_ressenti`: value must be an integer

#### String Filter Rules (lien_source):
- `op` must be one of: `'eq'`, `'contains'`
- `value` must be a non-empty string

### Validation Example (Node.js/TypeScript)

```typescript
function validateEarthquakeCriteria(criteria: any): boolean {
  // Check type
  if (criteria.type !== 'earthquake') return false;
  
  const filters = criteria.filters;
  
  // At least one filter must be defined
  if (!filters.magnitude && !filters.nb_ressenti && !filters.lien_source) {
    return false;
  }
  
  // Validate magnitude
  if (filters.magnitude) {
    if (!['gt', 'gte', 'lt', 'lte'].includes(filters.magnitude.op)) return false;
    if (typeof filters.magnitude.value !== 'number') return false;
    if (!isFinite(filters.magnitude.value)) return false;
  }
  
  // Validate nb_ressenti
  if (filters.nb_ressenti) {
    if (!['gt', 'gte', 'lt', 'lte'].includes(filters.nb_ressenti.op)) return false;
    if (typeof filters.nb_ressenti.value !== 'number') return false;
    if (!isFinite(filters.nb_ressenti.value)) return false;
    if (!Number.isInteger(filters.nb_ressenti.value)) return false;
  }
  
  // Validate lien_source
  if (filters.lien_source) {
    if (!['eq', 'contains'].includes(filters.lien_source.op)) return false;
    if (typeof filters.lien_source.value !== 'string') return false;
    if (filters.lien_source.value.trim().length === 0) return false;
  }
  
  return true;
}

function validateAlertCriterias(criterias: any[]): boolean {
  if (!Array.isArray(criterias)) return false;
  
  for (const criteria of criterias) {
    if (criteria.type === 'earthquake') {
      if (!validateEarthquakeCriteria(criteria)) return false;
    } else {
      // Unknown criteria type
      return false;
    }
  }
  
  return true;
}
```

## Event Matching Logic (DisastreamAPI)

The event matching logic needs to be updated to evaluate criterias when checking if an event matches an alert.

### Current Flow
1. Event arrives in queue (from disaster-eater)
2. DisastreamAPI reads event
3. Check if event location is in alert area
4. If match, send notifications

### Updated Flow
1. Event arrives in queue (from disaster-eater)
2. DisastreamAPI reads event
3. Check if event location is in alert area
4. **NEW: Check if event matches alert criterias (if defined)**
5. If both checks pass (logical AND), send notifications

### Implementation

#### Event Data Structure (Earthquake Example)

```typescript
interface EarthquakeEvent {
  id: number;
  alea_id: 1;  // Earthquake
  magnitude: number;
  nb_ressenti?: number;
  lien_source?: string;
  // ... other fields
  point: {
    type: 'Point';
    coordinates: [longitude, latitude];
  };
}
```

#### Criteria Matching Function

```typescript
function matchesNumericFilter(value: number, filter: NumericFilter): boolean {
  switch (filter.op) {
    case 'gt': return value > filter.value;
    case 'gte': return value >= filter.value;
    case 'lt': return value < filter.value;
    case 'lte': return value <= filter.value;
    default: return false;
  }
}

function matchesStringFilter(value: string, filter: StringFilter): boolean {
  switch (filter.op) {
    case 'eq': return value === filter.value;
    case 'contains': return value.includes(filter.value);
    default: return false;
  }
}

function matchesEarthquakeCriteria(
  event: EarthquakeEvent, 
  criteria: EarthquakeCriteria
): boolean {
  const filters = criteria.filters;
  
  // Check magnitude filter
  if (filters.magnitude) {
    if (!matchesNumericFilter(event.magnitude, filters.magnitude)) {
      return false;
    }
  }
  
  // Check nb_ressenti filter
  if (filters.nb_ressenti) {
    if (event.nb_ressenti === undefined || event.nb_ressenti === null) {
      return false;  // Event doesn't have this field
    }
    if (!matchesNumericFilter(event.nb_ressenti, filters.nb_ressenti)) {
      return false;
    }
  }
  
  // Check lien_source filter
  if (filters.lien_source) {
    if (!event.lien_source) {
      return false;  // Event doesn't have this field
    }
    if (!matchesStringFilter(event.lien_source, filters.lien_source)) {
      return false;
    }
  }
  
  return true;  // All filters passed
}

function matchesAlertCriterias(event: any, alert: Alert): boolean {
  // If no criterias defined, event matches (backward compatibility)
  if (!alert.criterias || alert.criterias.length === 0) {
    return true;
  }
  
  // Find criteria matching the event's alea type
  const eventAleaId = event.alea_id;
  
  for (const criteria of alert.criterias) {
    if (criteria.type === 'earthquake' && eventAleaId === 1) {
      return matchesEarthquakeCriteria(event, criteria);
    }
    // Future: Add other alea types here
  }
  
  // No matching criteria found for this event type
  return true;  // Allow event through if no specific criteria
}
```

#### Integration into Event Processing

```typescript
async function processEvent(event: any) {
  // Get all active alerts
  const alerts = await getActiveAlerts();
  
  for (const alert of alerts) {
    // Check if event alea type is monitored by this alert
    const monitorsThisAlea = alert.aleas.some(
      alea => alea.id === event.alea_id
    );
    if (!monitorsThisAlea) continue;
    
    // Check if event is in alert area
    const inArea = checkEventInArea(event.point, alert.areas);
    if (!inArea) continue;
    
    // NEW: Check if event matches alert criterias
    const matchesCriterias = matchesAlertCriterias(event, alert);
    if (!matchesCriterias) continue;
    
    // Both area and criteria checks passed - send notifications
    await sendNotifications(alert, event);
  }
}
```

## Testing

### Unit Tests

Create unit tests for:
1. Validation functions
2. Numeric filter matching
3. String filter matching
4. Earthquake criteria matching
5. Edge cases (missing fields, null values, etc.)

### Integration Tests

Test scenarios:
1. Create alert without criterias (backward compatibility)
2. Create alert with magnitude > 5.0 filter
3. Create alert with multiple filters (magnitude AND nb_ressenti)
4. Update alert to add criterias
5. Update alert to remove criterias
6. Event matching with various magnitude values
7. Event matching with missing optional fields

### Test Cases for Event Matching

```typescript
describe('Earthquake Criteria Matching', () => {
  it('should match earthquake with magnitude > 5.0', () => {
    const event = { alea_id: 1, magnitude: 5.5, /* ... */ };
    const criteria = {
      type: 'earthquake',
      filters: { magnitude: { op: 'gt', value: 5.0 } }
    };
    expect(matchesEarthquakeCriteria(event, criteria)).toBe(true);
  });
  
  it('should not match earthquake with magnitude <= 5.0', () => {
    const event = { alea_id: 1, magnitude: 4.9, /* ... */ };
    const criteria = {
      type: 'earthquake',
      filters: { magnitude: { op: 'gt', value: 5.0 } }
    };
    expect(matchesEarthquakeCriteria(event, criteria)).toBe(false);
  });
  
  it('should handle multiple filters with AND logic', () => {
    const event = { 
      alea_id: 1, 
      magnitude: 5.5, 
      nb_ressenti: 150,
      /* ... */ 
    };
    const criteria = {
      type: 'earthquake',
      filters: { 
        magnitude: { op: 'gt', value: 5.0 },
        nb_ressenti: { op: 'gte', value: 100 }
      }
    };
    expect(matchesEarthquakeCriteria(event, criteria)).toBe(true);
  });
  
  it('should fail when one filter does not match', () => {
    const event = { 
      alea_id: 1, 
      magnitude: 5.5, 
      nb_ressenti: 50,  // Too low
      /* ... */ 
    };
    const criteria = {
      type: 'earthquake',
      filters: { 
        magnitude: { op: 'gt', value: 5.0 },
        nb_ressenti: { op: 'gte', value: 100 }
      }
    };
    expect(matchesEarthquakeCriteria(event, criteria)).toBe(false);
  });
});
```

## Migration

### Database Migration

The `criterias` column already exists, but you may want to:
1. Add a default value of `[]` (empty array) for backward compatibility
2. Add database constraints if your DB supports JSON schema validation

```sql
-- PostgreSQL example
ALTER TABLE alerts 
ALTER COLUMN criterias SET DEFAULT '[]'::jsonb;

-- Ensure existing NULL values are converted to empty arrays
UPDATE alerts 
SET criterias = '[]'::jsonb 
WHERE criterias IS NULL;
```

### Deployment Strategy

1. **Phase 1: Backend API Changes**
   - Deploy validation middleware
   - Accept and store criterias in create/update endpoints
   - Return criterias in get endpoints
   - Test thoroughly

2. **Phase 2: Event Matching**
   - Deploy matching logic in DisastreamAPI
   - Enable criteria evaluation for new alerts
   - Monitor logs for errors

3. **Phase 3: Frontend Deploy**
   - Deploy frontend with criteria UI
   - Users can now create alerts with criterias
   - Monitor user feedback

## Future Enhancements

### Additional Alea Types

When adding support for other natural hazards:

1. Define new criteria type (e.g., `VolcanoCriteria`)
2. Add to discriminated union: `type AleaCriteria = EarthquakeCriteria | VolcanoCriteria | ...`
3. Add validation function
4. Add matching function
5. Update frontend UI

Example for volcanoes:
```typescript
interface VolcanoCriteria {
  type: 'volcano';
  filters: {
    vei?: NumericFilter;  // Volcanic Explosivity Index
    alert_level?: StringFilter;  // 'red', 'orange', etc.
  };
}
```

### Advanced Filtering

Future possibilities:
- Date/time filters (e.g., only weekdays)
- Compound conditions (OR logic between filters)
- Minimum/maximum thresholds
- Rate limiting (max N alerts per day)

## Support & Questions

For questions about this implementation:
- Frontend code: `src/app/Model/AlertCriteria.ts`
- Frontend tests: `src/app/Model/AlertCriteria.spec.ts`
- Frontend UI: `src/app/Pages/NewAlert/AlertCriterias/`
- Documentation: `README.md`
