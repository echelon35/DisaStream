import {
    NumericFilter,
    StringFilter,
    EarthquakeCriteria,
    isNumericOperator,
    isStringOperator,
    validateNumericFilter,
    validateStringFilter,
    validateEarthquakeCriteria
} from './AlertCriteria';

describe('AlertCriteria Models and Validation', () => {
    
    describe('Operator Type Guards', () => {
        it('should identify valid numeric operators', () => {
            expect(isNumericOperator('gt')).toBe(true);
            expect(isNumericOperator('gte')).toBe(true);
            expect(isNumericOperator('lt')).toBe(true);
            expect(isNumericOperator('lte')).toBe(true);
        });

        it('should reject invalid numeric operators', () => {
            expect(isNumericOperator('eq')).toBe(false);
            expect(isNumericOperator('invalid')).toBe(false);
            expect(isNumericOperator('')).toBe(false);
        });

        it('should identify valid string operators', () => {
            expect(isStringOperator('eq')).toBe(true);
            expect(isStringOperator('contains')).toBe(true);
        });

        it('should reject invalid string operators', () => {
            expect(isStringOperator('gt')).toBe(false);
            expect(isStringOperator('invalid')).toBe(false);
            expect(isStringOperator('')).toBe(false);
        });
    });

    describe('NumericFilter Validation', () => {
        it('should validate correct numeric filters', () => {
            const validFilters: NumericFilter[] = [
                { op: 'gt', value: 5.0 },
                { op: 'gte', value: 0 },
                { op: 'lt', value: 10.5 },
                { op: 'lte', value: -5 }
            ];

            validFilters.forEach(filter => {
                expect(validateNumericFilter(filter)).toBe(true);
            });
        });

        it('should reject numeric filters with invalid operators', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const invalidFilter = { op: 'invalid' as any, value: 5.0 };
            expect(validateNumericFilter(invalidFilter)).toBe(false);
        });

        it('should reject numeric filters with invalid values', () => {
            const infinityFilter = { op: 'gt' as const, value: Infinity };
            const nanFilter = { op: 'gt' as const, value: NaN };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonNumericFilter = { op: 'gt' as const, value: 'text' as any };

            expect(validateNumericFilter(infinityFilter)).toBe(false);
            expect(validateNumericFilter(nanFilter)).toBe(false);
            expect(validateNumericFilter(nonNumericFilter)).toBe(false);
        });
    });

    describe('StringFilter Validation', () => {
        it('should validate correct string filters', () => {
            const validFilters: StringFilter[] = [
                { op: 'eq', value: 'USGS' },
                { op: 'contains', value: 'test' }
            ];

            validFilters.forEach(filter => {
                expect(validateStringFilter(filter)).toBe(true);
            });
        });

        it('should reject string filters with invalid operators', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const invalidFilter = { op: 'invalid' as any, value: 'text' };
            expect(validateStringFilter(invalidFilter)).toBe(false);
        });

        it('should reject string filters with empty values', () => {
            const emptyFilter = { op: 'eq' as const, value: '' };
            expect(validateStringFilter(emptyFilter)).toBe(false);
        });

        it('should reject string filters with non-string values', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonStringFilter = { op: 'eq' as const, value: 123 as any };
            expect(validateStringFilter(nonStringFilter)).toBe(false);
        });
    });

    describe('EarthquakeCriteria Validation', () => {
        it('should validate earthquake criteria with magnitude filter', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gt', value: 5.0 }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(true);
        });

        it('should validate earthquake criteria with nb_ressenti filter', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    nb_ressenti: { op: 'gte', value: 100 }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(true);
        });

        it('should validate earthquake criteria with lien_source filter', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    lien_source: { op: 'contains', value: 'USGS' }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(true);
        });

        it('should validate earthquake criteria with multiple filters', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gt', value: 5.0 },
                    nb_ressenti: { op: 'gte', value: 50 },
                    lien_source: { op: 'eq', value: 'USGS' }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(true);
        });

        it('should reject earthquake criteria with wrong type', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const criteria: any = {
                type: 'flood',
                filters: {
                    magnitude: { op: 'gt', value: 5.0 }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(false);
        });

        it('should reject earthquake criteria with no filters', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {}
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(false);
        });

        it('should reject earthquake criteria with invalid magnitude filter', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gt', value: NaN }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(false);
        });

        it('should reject earthquake criteria with non-integer nb_ressenti', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    nb_ressenti: { op: 'gt', value: 5.5 }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(false);
        });

        it('should reject earthquake criteria with invalid lien_source filter', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    lien_source: { op: 'contains', value: '' }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(false);
        });

        it('should handle magnitude threshold validation correctly', () => {
            // Test case: magnitude > 5.0 should filter earthquakes below 5.0
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gt', value: 5.0 }
                }
            };
            expect(validateEarthquakeCriteria(criteria)).toBe(true);

            // Note: Actual event matching logic would be in backend
            // Here we just verify the criteria structure is valid
            // Example test cases for backend:
            // { magnitude: 4.9, shouldPass: false },
            // { magnitude: 5.0, shouldPass: false },
            // { magnitude: 5.1, shouldPass: true },
            // { magnitude: 6.5, shouldPass: true }
        });

        it('should handle multiple operator types correctly', () => {
            const criteriaGt: EarthquakeCriteria = {
                type: 'earthquake',
                filters: { magnitude: { op: 'gt', value: 5.0 } }
            };
            const criteriaGte: EarthquakeCriteria = {
                type: 'earthquake',
                filters: { magnitude: { op: 'gte', value: 5.0 } }
            };
            const criteriaLt: EarthquakeCriteria = {
                type: 'earthquake',
                filters: { magnitude: { op: 'lt', value: 5.0 } }
            };
            const criteriaLte: EarthquakeCriteria = {
                type: 'earthquake',
                filters: { magnitude: { op: 'lte', value: 5.0 } }
            };

            expect(validateEarthquakeCriteria(criteriaGt)).toBe(true);
            expect(validateEarthquakeCriteria(criteriaGte)).toBe(true);
            expect(validateEarthquakeCriteria(criteriaLt)).toBe(true);
            expect(validateEarthquakeCriteria(criteriaLte)).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        it('should create valid earthquake criteria for real-world use case', () => {
            // Use case: Alert only for significant earthquakes (magnitude > 5) 
            // with many reports (nb_ressenti > 100) from USGS
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gt', value: 5.0 },
                    nb_ressenti: { op: 'gt', value: 100 },
                    lien_source: { op: 'contains', value: 'USGS' }
                }
            };

            expect(validateEarthquakeCriteria(criteria)).toBe(true);
            expect(criteria.type).toBe('earthquake');
            expect(criteria.filters.magnitude?.op).toBe('gt');
            expect(criteria.filters.magnitude?.value).toBe(5.0);
        });

        it('should serialize and deserialize correctly', () => {
            const criteria: EarthquakeCriteria = {
                type: 'earthquake',
                filters: {
                    magnitude: { op: 'gte', value: 4.5 }
                }
            };

            // Simulate JSON serialization (as would happen when sending to backend)
            const json = JSON.stringify(criteria);
            const parsed = JSON.parse(json) as EarthquakeCriteria;

            expect(parsed.type).toBe('earthquake');
            expect(parsed.filters.magnitude?.op).toBe('gte');
            expect(parsed.filters.magnitude?.value).toBe(4.5);
            expect(validateEarthquakeCriteria(parsed)).toBe(true);
        });
    });
});
