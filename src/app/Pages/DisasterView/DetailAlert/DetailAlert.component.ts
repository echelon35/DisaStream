import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryDisaster } from 'src/app/DTO/HistoryDisaster.dto';
import { Alert } from 'src/app/Model/Alert';
import { AlertApiService } from 'src/app/Services/AlertApiService';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';

@Component({
    selector: 'app-detail-alert',
    templateUrl: './DetailAlert.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailAlertComponent {

  alert?: Alert;
  close$ = output<boolean>();
  zoom$ = output<Alert>();
  disastersToDisplay$ = output<HistoryDisaster[]>();
  historyDisasters: HistoryDisaster[] = [];
  count: number = 0;
  load: boolean = false;

  //Pagination
  currentPage = 1;
  nbPage = 0;
  limit = 20;

  //Change detector to update component manually
  private cd = inject(ChangeDetectorRef)

  constructor(private alertApiService: AlertApiService, 
    private router: Router,
    private toastrService: ToastrService){
      this.load = true;
  }

  back(){
    this.alert = undefined;
    this.close$.emit(true);
  }

  open(alert: Alert | undefined){
    if(alert != null){
      this.alert = alert;
      this.updateComponent()
      this.changePage(1);
    }
  }

  zoom(){
    this.zoom$.emit(this.alert!);
  }

  changePage(page: number){
      this.load = true;
      this.historyDisasters = [];
      this.alertApiService.getDisastersAlerts(this.alert!.id, page).subscribe(items => {
        console.log(items);
        items.disasters.forEach(d => {
          const hDisaster = new HistoryDisaster(d);
          this.historyDisasters.push(hDisaster)
        });
        this.disastersToDisplay$.emit(this.historyDisasters)
        this.count = items.count;

        this.load = false;
        this.currentPage = page;
        this.nbPage = Math.ceil(this.count / this.limit);

        this.updateComponent()
      });
  }

  /**
   * Update view
   */
  updateComponent(){
      this.cd.markForCheck();
  }

}
