import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Alea } from "src/app/Model/Alea";
import { 
    AleaCriteria, 
    EarthquakeCriteria, 
    EarthquakeCriteriaFilters,
    NumericOperator, 
    StringOperator,
    NumericFilter,
    StringFilter
} from "src/app/Model/AlertCriteria";

interface EarthquakeCriteriaVM {
    magnitude?: {
        operator: NumericOperator;
        value: number | null;
    };
    nb_ressenti?: {
        operator: NumericOperator;
        value: number | null;
    };
    lien_source?: {
        operator: StringOperator;
        value: string;
    };
}

@Component({
    selector: "app-alert-criterias",
    templateUrl: './AlertCriterias.Component.html',
    styleUrls: ['./AlertCriterias.Component.css'],
})
export class AlertCriteriasComponent implements OnChanges {
    @Input() selectedAleas: Alea[] = [];
    @Output() criteriasChange = new EventEmitter<AleaCriteria[]>();

    // Earthquake (id=1) specific criteria
    earthquakeCriteria: EarthquakeCriteriaVM = {};
    
    // Track if earthquake is selected
    hasEarthquake = false;

    numericOperators = [
        { value: 'gt' as NumericOperator, label: '>' },
        { value: 'gte' as NumericOperator, label: '>=' },
        { value: 'lt' as NumericOperator, label: '<' },
        { value: 'lte' as NumericOperator, label: '<=' }
    ];

    stringOperators = [
        { value: 'eq' as StringOperator, label: 'Égal à' },
        { value: 'contains' as StringOperator, label: 'Contient' }
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedAleas']) {
            this.hasEarthquake = this.selectedAleas.some(alea => alea.id === 1);
            if (!this.hasEarthquake) {
                // Clear earthquake criteria if earthquake is deselected
                this.earthquakeCriteria = {};
            }
            this.emitCriterias();
        }
    }

    /**
     * Enable/disable magnitude criteria
     */
    toggleMagnitudeCriteria(enabled: boolean): void {
        if (enabled) {
            this.earthquakeCriteria.magnitude = {
                operator: 'gt',
                value: null
            };
        } else {
            delete this.earthquakeCriteria.magnitude;
        }
        this.emitCriterias();
    }

    /**
     * Enable/disable nb_ressenti criteria
     */
    toggleNbRessentiCriteria(enabled: boolean): void {
        if (enabled) {
            this.earthquakeCriteria.nb_ressenti = {
                operator: 'gt',
                value: null
            };
        } else {
            delete this.earthquakeCriteria.nb_ressenti;
        }
        this.emitCriterias();
    }

    /**
     * Enable/disable lien_source criteria
     */
    toggleLienSourceCriteria(enabled: boolean): void {
        if (enabled) {
            this.earthquakeCriteria.lien_source = {
                operator: 'eq',
                value: ''
            };
        } else {
            delete this.earthquakeCriteria.lien_source;
        }
        this.emitCriterias();
    }

    /**
     * Check if magnitude criteria is enabled
     */
    isMagnitudeEnabled(): boolean {
        return this.earthquakeCriteria.magnitude !== undefined;
    }

    /**
     * Check if nb_ressenti criteria is enabled
     */
    isNbRessentiEnabled(): boolean {
        return this.earthquakeCriteria.nb_ressenti !== undefined;
    }

    /**
     * Check if lien_source criteria is enabled
     */
    isLienSourceEnabled(): boolean {
        return this.earthquakeCriteria.lien_source !== undefined;
    }

    /**
     * Validate and emit criteria changes
     */
    emitCriterias(): void {
        const criterias: AleaCriteria[] = [];

        // Build earthquake criteria if earthquake is selected
        if (this.hasEarthquake) {
            const filters: EarthquakeCriteriaFilters = {};

            // Add magnitude filter if configured
            if (this.earthquakeCriteria.magnitude?.value !== null && 
                this.earthquakeCriteria.magnitude?.value !== undefined) {
                filters.magnitude = {
                    op: this.earthquakeCriteria.magnitude.operator,
                    value: this.earthquakeCriteria.magnitude.value
                } as NumericFilter;
            }

            // Add nb_ressenti filter if configured
            if (this.earthquakeCriteria.nb_ressenti?.value !== null && 
                this.earthquakeCriteria.nb_ressenti?.value !== undefined) {
                filters.nb_ressenti = {
                    op: this.earthquakeCriteria.nb_ressenti.operator,
                    value: Math.floor(this.earthquakeCriteria.nb_ressenti.value) // Ensure integer
                } as NumericFilter;
            }

            // Add lien_source filter if configured
            if (this.earthquakeCriteria.lien_source?.value && 
                this.earthquakeCriteria.lien_source.value.trim() !== '') {
                filters.lien_source = {
                    op: this.earthquakeCriteria.lien_source.operator,
                    value: this.earthquakeCriteria.lien_source.value.trim()
                } as StringFilter;
            }

            // Only add earthquake criteria if at least one filter is set
            if (Object.keys(filters).length > 0) {
                criterias.push({
                    type: 'earthquake',
                    filters
                } as EarthquakeCriteria);
            }
        }

        this.criteriasChange.emit(criterias);
    }

    /**
     * Validate magnitude value
     */
    validateMagnitude(): boolean {
        const value = this.earthquakeCriteria.magnitude?.value;
        return value !== null && value !== undefined && !isNaN(value) && isFinite(value) && value >= 0;
    }

    /**
     * Validate nb_ressenti value
     */
    validateNbRessenti(): boolean {
        const value = this.earthquakeCriteria.nb_ressenti?.value;
        return value !== null && value !== undefined && !isNaN(value) && Number.isInteger(value) && value >= 0;
    }

    /**
     * Validate lien_source value
     */
    validateLienSource(): boolean {
        const value = this.earthquakeCriteria.lien_source?.value;
        return value !== undefined && value !== null && value.trim().length > 0;
    }
}