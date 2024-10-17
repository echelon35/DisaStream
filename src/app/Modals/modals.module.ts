import { NgModule } from '@angular/core';
import { SearchPlace } from './SearchPlace/SearchPlace.modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddMailAlert } from './AddMailAlert/AddMailAlert.modal';

@NgModule({
    declarations: [SearchPlace, AddMailAlert],
    imports: [CommonModule, FormsModule],
    exports: [SearchPlace, AddMailAlert],
})
export class ModalsModule { }
