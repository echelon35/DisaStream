import {
  matchesNumericFilter,
  isValidNumericFilter,
  getOperatorLabel,
  NumericFilter,
  EarthquakeCriteria,
  FloodCriteria
} from './AleaCriteria';

describe('AleaCriteria', () => {
  describe('getOperatorLabel', () => {
    it('should return correct label for gt operator', () => {
      expect(getOperatorLabel('gt')).toBe('>');
    });

    it('should return correct label for gte operator', () => {
      expect(getOperatorLabel('gte')).toBe('>=');
    });

    it('should return correct label for lt operator', () => {
      expect(getOperatorLabel('lt')).toBe('<');
    });

    it('should return correct label for lte operator', () => {
      expect(getOperatorLabel('lte')).toBe('<=');
    });
  });

  describe('isValidNumericFilter', () => {
    it('should return true for undefined filter', () => {
      expect(isValidNumericFilter(undefined)).toBe(true);
    });

    it('should return true for valid filter', () => {
      const filter: NumericFilter = { operator: 'gt', value: 5 };
      expect(isValidNumericFilter(filter)).toBe(true);
    });

    it('should return false for filter with NaN value', () => {
      const filter: NumericFilter = { operator: 'gt', value: NaN };
      expect(isValidNumericFilter(filter)).toBe(false);
    });

    it('should return false for filter with invalid operator', () => {
      const filter: any = { operator: 'invalid', value: 5 };
      expect(isValidNumericFilter(filter)).toBe(false);
    });
  });

  describe('matchesNumericFilter', () => {
    it('should return true when filter is undefined', () => {
      expect(matchesNumericFilter(5, undefined)).toBe(true);
    });

    it('should correctly match gt operator', () => {
      const filter: NumericFilter = { operator: 'gt', value: 5 };
      expect(matchesNumericFilter(6, filter)).toBe(true);
      expect(matchesNumericFilter(5, filter)).toBe(false);
      expect(matchesNumericFilter(4, filter)).toBe(false);
    });

    it('should correctly match gte operator', () => {
      const filter: NumericFilter = { operator: 'gte', value: 5 };
      expect(matchesNumericFilter(6, filter)).toBe(true);
      expect(matchesNumericFilter(5, filter)).toBe(true);
      expect(matchesNumericFilter(4, filter)).toBe(false);
    });

    it('should correctly match lt operator', () => {
      const filter: NumericFilter = { operator: 'lt', value: 5 };
      expect(matchesNumericFilter(4, filter)).toBe(true);
      expect(matchesNumericFilter(5, filter)).toBe(false);
      expect(matchesNumericFilter(6, filter)).toBe(false);
    });

    it('should correctly match lte operator', () => {
      const filter: NumericFilter = { operator: 'lte', value: 5 };
      expect(matchesNumericFilter(4, filter)).toBe(true);
      expect(matchesNumericFilter(5, filter)).toBe(true);
      expect(matchesNumericFilter(6, filter)).toBe(false);
    });
  });

  describe('EarthquakeCriteria', () => {
    it('should match earthquake with magnitude greater than threshold', () => {
      const criteria: EarthquakeCriteria = {
        type: 'earthquake',
        magnitude: { operator: 'gt', value: 5.0 }
      };

      // Earthquake with magnitude 6.0 should match
      const earthquakeMagnitude = 6.0;
      expect(matchesNumericFilter(earthquakeMagnitude, criteria.magnitude)).toBe(true);

      // Earthquake with magnitude 4.0 should not match
      const smallEarthquakeMagnitude = 4.0;
      expect(matchesNumericFilter(smallEarthquakeMagnitude, criteria.magnitude)).toBe(false);
    });

    it('should match earthquake with magnitude greater than or equal to threshold', () => {
      const criteria: EarthquakeCriteria = {
        type: 'earthquake',
        magnitude: { operator: 'gte', value: 5.0 }
      };

      expect(matchesNumericFilter(5.0, criteria.magnitude)).toBe(true);
      expect(matchesNumericFilter(5.5, criteria.magnitude)).toBe(true);
      expect(matchesNumericFilter(4.9, criteria.magnitude)).toBe(false);
    });

    it('should allow earthquake criteria without filters', () => {
      const criteria: EarthquakeCriteria = {
        type: 'earthquake'
      };

      // Should match any magnitude when no filter is set
      expect(matchesNumericFilter(2.0, criteria.magnitude)).toBe(true);
      expect(matchesNumericFilter(7.0, criteria.magnitude)).toBe(true);
    });
  });

  describe('FloodCriteria', () => {
    it('should match flood with level greater than threshold', () => {
      const criteria: FloodCriteria = {
        type: 'flood',
        level: { operator: 'gt', value: 2.0 }
      };

      expect(matchesNumericFilter(3.0, criteria.level)).toBe(true);
      expect(matchesNumericFilter(1.5, criteria.level)).toBe(false);
    });

    it('should allow flood criteria without filters', () => {
      const criteria: FloodCriteria = {
        type: 'flood'
      };

      expect(matchesNumericFilter(1.0, criteria.level)).toBe(true);
      expect(matchesNumericFilter(5.0, criteria.level)).toBe(true);
    });
  });
});
