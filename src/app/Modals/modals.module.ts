import { NgModule } from '@angular/core';
import { SearchPlace } from './SearchPlace/SearchPlace.modal';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMailAlert } from './AddMailAlert/AddMailAlert.modal';
import { DisasterDetailComponent } from './DisasterDetail/disaster-detail.component';
import { MapModule } from '../Map/map.module';
import { SharedModule } from '../Shared/Shared.module';
import { EndAlertComponent } from './EndAlert/EndAlert.modal';
import { FreeModeComponent } from './FreeMode/FreeMode.modal';
import { ProPacksComponent } from './ProPacks/ProPacks.modal';
import { DeleteConfirmModal } from './DeleteConfirm/DeleteConfirm.modal';

@NgModule({
    declarations: [SearchPlace, AddMailAlert, DisasterDetailComponent, EndAlertComponent, FreeModeComponent, ProPacksComponent, DeleteConfirmModal],
    imports: [CommonModule, FormsModule, MapModule, SharedModule, ReactiveFormsModule],
    exports: [SearchPlace, AddMailAlert, DisasterDetailComponent, EndAlertComponent, FreeModeComponent, ProPacksComponent, DeleteConfirmModal],
})
export class ModalsModule { }
