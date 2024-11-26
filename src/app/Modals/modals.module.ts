import { NgModule } from '@angular/core';
import { SearchPlace } from './SearchPlace/SearchPlace.modal';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMailAlert } from './AddMailAlert/AddMailAlert.modal';
import { DisasterDetailComponent } from './DisasterDetail/disaster-detail.component';
import { MapModule } from '../Map/map.module';
import { SharedModule } from '../Shared/Shared.module';
import { EndAlertComponent } from './EndAlert/EndAlert.modal';

@NgModule({
    declarations: [SearchPlace, AddMailAlert, DisasterDetailComponent, EndAlertComponent],
    imports: [CommonModule, FormsModule, MapModule, SharedModule, ReactiveFormsModule],
    exports: [SearchPlace, AddMailAlert, DisasterDetailComponent, EndAlertComponent],
})
export class ModalsModule { }
