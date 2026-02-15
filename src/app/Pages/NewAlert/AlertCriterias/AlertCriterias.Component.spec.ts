
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertCriteriasComponent } from './AlertCriterias.component';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlertCriteriasComponent', () => {
    let component: AlertCriteriasComponent;
    let fixture: ComponentFixture<AlertCriteriasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertCriteriasComponent, CommonModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(AlertCriteriasComponent, {
                add: {
                    imports: [CommonModule],
                    schemas: [NO_ERRORS_SCHEMA]
                }
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertCriteriasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add criteria', () => {
        const initialLength = component.AlertCriteriaVMList.length;
        component.addCriteria();
        expect(component.AlertCriteriaVMList.length).toBe(initialLength + 1);
    });

    it('should remove criteria', () => {
        component.addCriteria();
        const lengthAfterAdd = component.AlertCriteriaVMList.length;
        component.removeCriteria(lengthAfterAdd - 1);
        expect(component.AlertCriteriaVMList.length).toBe(lengthAfterAdd - 1);
    });
});
