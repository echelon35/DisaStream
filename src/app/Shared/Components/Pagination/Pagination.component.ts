
import { Component, Input, output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './Pagination.component.html'
})
export class Pagination {
    @Input() currentPage = 1;
    @Input() nbPage = 0;
    page$ = output<number>();

    changePage(page: number){
        this.page$.emit(page);
    }
}