/**
 * Operator types for comparing numeric values
 */
export type ComparisonOperator = 'gt' | 'gte' | 'lt' | 'lte';

/**
 * Base interface for all alea-specific criteria
 */
export interface BaseAleaCriteria {
  type: string;
}

/**
 * Numeric filter for properties like magnitude, depth, etc.
 */
export interface NumericFilter {
  operator: ComparisonOperator;
  value: number;
}

/**
 * Criteria specific to earthquake alerts
 */
export interface EarthquakeCriteria extends BaseAleaCriteria {
  type: 'earthquake';
  magnitude?: NumericFilter;
  depth?: NumericFilter;
}

/**
 * Criteria specific to flood alerts
 */
export interface FloodCriteria extends BaseAleaCriteria {
  type: 'flood';
  level?: NumericFilter;
}

/**
 * Union type for all possible alea criteria
 * Add new criteria types here as they are implemented
 */
export type AleaCriteriaType = EarthquakeCriteria | FloodCriteria;

/**
 * Helper function to get a human-readable operator label
 */
export function getOperatorLabel(operator: ComparisonOperator): string {
  switch (operator) {
    case 'gt':
      return '>';
    case 'gte':
      return '>=';
    case 'lt':
      return '<';
    case 'lte':
      return '<=';
    default:
      return operator;
  }
}

/**
 * Helper function to validate numeric filter
 */
export function isValidNumericFilter(filter: NumericFilter | undefined): boolean {
  if (!filter) return true;
  return (
    filter.value !== null &&
    filter.value !== undefined &&
    !isNaN(filter.value) &&
    ['gt', 'gte', 'lt', 'lte'].includes(filter.operator)
  );
}

/**
 * Helper function to check if a value matches a numeric filter
 */
export function matchesNumericFilter(
  value: number,
  filter: NumericFilter | undefined
): boolean {
  if (!filter) return true;

  switch (filter.operator) {
    case 'gt':
      return value > filter.value;
    case 'gte':
      return value >= filter.value;
    case 'lt':
      return value < filter.value;
    case 'lte':
      return value <= filter.value;
    default:
      return true;
  }
}
