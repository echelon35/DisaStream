import { Alea } from "./Alea";

export enum CriteriaType {
    LESS = "<",
    MORE = ">",
    LESS_EQUAL = "<=",
    MORE_EQUAL = ">=",
    EQUAL = "="
}

export class Criteria {
    alea: Alea = new Alea();
    name = "";
    label = "";
}

export class AlertCriteria {
    criteria: Criteria = new Criteria();
    criteriaType?: CriteriaType;
    value = "";

    constructor(criteria: Criteria){
        this.criteria = criteria;
    }
}

// New discriminated criteria types for per-alea filtering
export type NumericOperator = 'gt' | 'gte' | 'lt' | 'lte';
export type StringOperator = 'eq' | 'contains';

export interface NumericFilter {
    op: NumericOperator;
    value: number;
}

export interface StringFilter {
    op: StringOperator;
    value: string;
}

// Earthquake-specific criteria
export interface EarthquakeCriteriaFilters {
    magnitude?: NumericFilter;
    nb_ressenti?: NumericFilter;
    lien_source?: StringFilter;
}

export interface EarthquakeCriteria {
    type: 'earthquake';
    filters: EarthquakeCriteriaFilters;
}

// Union type for all criteria types (extensible for future alea types)
export type AleaCriteria = EarthquakeCriteria;

// Helper functions for validation
export function isNumericOperator(op: string): op is NumericOperator {
    return ['gt', 'gte', 'lt', 'lte'].includes(op);
}

export function isStringOperator(op: string): op is StringOperator {
    return ['eq', 'contains'].includes(op);
}

export function validateNumericFilter(filter: NumericFilter): boolean {
    return isNumericOperator(filter.op) && typeof filter.value === 'number' && isFinite(filter.value);
}

export function validateStringFilter(filter: StringFilter): boolean {
    return isStringOperator(filter.op) && typeof filter.value === 'string' && filter.value.length > 0;
}

export function validateEarthquakeCriteria(criteria: EarthquakeCriteria): boolean {
    if (criteria.type !== 'earthquake') return false;
    
    const filters = criteria.filters;
    
    // At least one filter must be defined
    if (!filters.magnitude && !filters.nb_ressenti && !filters.lien_source) {
        return false;
    }
    
    // Validate magnitude if present
    if (filters.magnitude && !validateNumericFilter(filters.magnitude)) {
        return false;
    }
    
    // Validate nb_ressenti if present (should be integer)
    if (filters.nb_ressenti) {
        if (!validateNumericFilter(filters.nb_ressenti) || !Number.isInteger(filters.nb_ressenti.value)) {
            return false;
        }
    }
    
    // Validate lien_source if present
    if (filters.lien_source && !validateStringFilter(filters.lien_source)) {
        return false;
    }
    
    return true;
}