import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ToastrContent, ToastrService, ToastrType } from "../../Services/toastr.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-toastr',
    templateUrl: './Toastr.component.html',
  })
export class ToastrComponent implements OnInit {

    toastrs$: Observable<ToastrContent[] | null>;
    readonly ToastrType = ToastrType;
    toastrs: ToastrContent[] | null;

    constructor(private toastrService: ToastrService){}

    ngOnInit(): void {
        this.toastrs$ = this.toastrService.toastrContent$;
    }

    hide(content: ToastrContent){
        this.toastrService.hide(content);
    }
}