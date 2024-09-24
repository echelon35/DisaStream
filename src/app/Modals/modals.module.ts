import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SearchPlace } from './SearchPlace/SearchPlace.modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [SearchPlace],
    imports: [CommonModule, FormsModule],
    exports: [SearchPlace],
})
export class ModalsModule { }
