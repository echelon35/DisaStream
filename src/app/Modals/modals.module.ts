import { NgModule } from '@angular/core';
import { SearchPlace } from './SearchPlace/SearchPlace.modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddMailAlert } from './AddMailAlert/AddMailAlert.modal';
import { DisasterDetailComponent } from './DisasterDetail/disaster-detail.component';
import { MapModule } from '../Map/map.module';

@NgModule({
    declarations: [SearchPlace, AddMailAlert, DisasterDetailComponent],
    imports: [CommonModule, FormsModule, MapModule],
    exports: [SearchPlace, AddMailAlert, DisasterDetailComponent],
})
export class ModalsModule { }
