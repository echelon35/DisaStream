import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Alea } from 'src/app/Model/Alea';
import {
  AleaCriteriaType,
  EarthquakeCriteria,
  FloodCriteria,
  NumericFilter,
  ComparisonOperator,
  getOperatorLabel
} from 'src/app/Model/AleaCriteria';

interface OperatorOption {
  value: ComparisonOperator;
  label: string;
}

@Component({
  selector: 'app-alea-criteria-input',
  templateUrl: './AleaCriteriaInput.component.html',
  styleUrls: ['./AleaCriteriaInput.component.css']
})
export class AleaCriteriaInputComponent implements OnInit, OnChanges {
  @Input() selectedAleas: Alea[] = [];
  @Input() initialCriteria?: AleaCriteriaType[];
  @Output() criteriaChange = new EventEmitter<AleaCriteriaType[]>();

  criteria: AleaCriteriaType[] = [];

  operatorOptions: OperatorOption[] = [
    { value: 'gt', label: '>' },
    { value: 'gte', label: '>=' },
    { value: 'lt', label: '<' },
    { value: 'lte', label: '<=' }
  ];

  ngOnInit() {
    this.initializeCriteria();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAleas']) {
      this.initializeCriteria();
    }
  }

  private initializeCriteria() {
    // Initialize criteria based on selected aleas
    this.criteria = [];

    this.selectedAleas.forEach(alea => {
      const aleaName = alea.name.toLowerCase();
      
      // Check if we already have criteria for this alea from initial data
      const existingCriteria = this.initialCriteria?.find(c => {
        if (aleaName === 'seisme' || aleaName === 'séisme' || aleaName === 'earthquake') {
          return c.type === 'earthquake';
        }
        if (aleaName === 'inondation' || aleaName === 'flood') {
          return c.type === 'flood';
        }
        return false;
      });

      if (aleaName === 'seisme' || aleaName === 'séisme' || aleaName === 'earthquake') {
        const earthquakeCriteria: EarthquakeCriteria = existingCriteria as EarthquakeCriteria || {
          type: 'earthquake',
          magnitude: undefined,
          depth: undefined
        };
        this.criteria.push(earthquakeCriteria);
      } else if (aleaName === 'inondation' || aleaName === 'flood') {
        const floodCriteria: FloodCriteria = existingCriteria as FloodCriteria || {
          type: 'flood',
          level: undefined
        };
        this.criteria.push(floodCriteria);
      }
    });

    this.emitCriteria();
  }

  isEarthquakeCriteria(criteria: AleaCriteriaType): criteria is EarthquakeCriteria {
    return criteria.type === 'earthquake';
  }

  isFloodCriteria(criteria: AleaCriteriaType): criteria is FloodCriteria {
    return criteria.type === 'flood';
  }

  onMagnitudeOperatorChange(criteria: EarthquakeCriteria, operator: ComparisonOperator) {
    if (!criteria.magnitude) {
      criteria.magnitude = { operator, value: 5 };
    } else {
      criteria.magnitude.operator = operator;
    }
    this.emitCriteria();
  }

  onMagnitudeValueChange(criteria: EarthquakeCriteria, value: string) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (!criteria.magnitude) {
        criteria.magnitude = { operator: 'gt', value: numValue };
      } else {
        criteria.magnitude.value = numValue;
      }
      this.emitCriteria();
    }
  }

  onFloodLevelOperatorChange(criteria: FloodCriteria, operator: ComparisonOperator) {
    if (!criteria.level) {
      criteria.level = { operator, value: 1 };
    } else {
      criteria.level.operator = operator;
    }
    this.emitCriteria();
  }

  onFloodLevelValueChange(criteria: FloodCriteria, value: string) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (!criteria.level) {
        criteria.level = { operator: 'gt', value: numValue };
      } else {
        criteria.level.value = numValue;
      }
      this.emitCriteria();
    }
  }

  getCriteriaLabel(criteria: AleaCriteriaType): string {
    if (this.isEarthquakeCriteria(criteria)) {
      return 'Séisme';
    } else if (this.isFloodCriteria(criteria)) {
      return 'Inondation';
    }
    return 'Aléa';
  }

  private emitCriteria() {
    // Only emit criteria that have at least one filter defined
    const validCriteria = this.criteria.filter(c => {
      if (this.isEarthquakeCriteria(c)) {
        return c.magnitude !== undefined;
      } else if (this.isFloodCriteria(c)) {
        return c.level !== undefined;
      }
      return false;
    });

    this.criteriaChange.emit(validCriteria);
  }

  clearMagnitude(criteria: EarthquakeCriteria) {
    criteria.magnitude = undefined;
    this.emitCriteria();
  }

  clearFloodLevel(criteria: FloodCriteria) {
    criteria.level = undefined;
    this.emitCriteria();
  }
}
