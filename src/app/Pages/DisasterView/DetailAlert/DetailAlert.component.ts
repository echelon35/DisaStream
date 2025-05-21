import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { DisasterAlertDto } from 'src/app/DTO/DisasterAlertDto';
import { DisasterFromAlertDtoEarthquake, DisasterFromAlertDtoEruption, DisasterFromAlertDtoFlood, DisasterFromAlertDtoHurricane } from 'src/app/DTO/DisasterFromAlertDto';
import { Alert } from 'src/app/Model/Alert';
import { Disaster } from 'src/app/Model/Disaster';
import { Earthquake } from 'src/app/Model/Earthquake';
import { Eruption } from 'src/app/Model/Eruption';
import { Flood } from 'src/app/Model/Flood';
import { Hurricane } from 'src/app/Model/Hurricane';
import { AlertApiService } from 'src/app/Services/AlertApiService';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';
import $ from 'jquery';

interface Filter {
  name: string;
  order: string;
}

@Component({
    selector: 'app-detail-alert',
    templateUrl: './DetailAlert.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailAlertComponent {

  alert?: Alert;
  close$ = output<boolean>();
  zoomAlert$ = output<Alert>();
  zoomDisaster$ = output<Disaster>();
  hoverDisaster$ = output<Disaster>();
  closePanel$ = output<void>();
  disastersToDisplay$ = output<Disaster[]>();
  historyDisasters: Disaster[] = [];
  count = 0;
  counted = false;
  allCount = 0;
  load = false;
  expandPanel = false;

  currentFilter = 'premier_releve';
  currentOrder = 'ASC';
  filters: Filter[] = [
    { name: 'premier_releve', order: 'ASC' },
    { name: 'dernier_releve', order: 'ASC' },
    { name: 'power', order: 'ASC' },
    { name: 'type', order: 'ASC' },
    { name: 'country', order: 'ASC' },
    { name: 'city', order: 'ASC' }
  ];
  filterCountry = '';
  filterCity = '';
  now = new Date();
  filterFrom = new Date('2000-01-01').toISOString().split('T').shift();
  filterTo = new Date().toISOString().split('T').shift();

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

  expand(expand: boolean){
    this.expandPanel = expand;
  }

  disableAlert(){
    const id = this.alert!.id;
    this.alertApiService.activateAlert(id,false).subscribe(() => {
      this.toastrService.info('Alerte désactivée');
      this.alert!.isActivate = false;
      this.updateComponent();
    });
  }

  activateAlert(){
    const id = this.alert!.id;
    this.alertApiService.activateAlert(id,true).subscribe(() => {
      this.toastrService.info('Alerte activée');
      this.alert!.isActivate = true;
      this.updateComponent();
    });
  }

  searchCity(){
    this.changePage(1);
  }

  clearCity(){
    this.filterCity = '';
    this.changePage(1);
  }

  searchCountry(){
    this.changePage(1);
  }

  clearCountry(){
    this.filterCountry = '';
    this.changePage(1);
  }

  searchFrom(event: any){
    if(event.target.value.length > 0){
      this.filterFrom = event.target.value;
      this.changePage(1);
    }
  }

  searchTo(event: any){
    if(event.target.value.length > 0){
      this.filterTo = event.target.value;
      this.changePage(1);
    }
  }

  open(alert: Alert | undefined){
    if(alert != null){
      this.alert = alert;
      this.updateComponent()
      this.changePage(1);
    }
  }

  zoomOnAlert(){
    this.zoomAlert$.emit(this.alert!);
  }

  zoomOnDisaster(disaster: Disaster){
    this.zoomDisaster$.emit(disaster);
    this.closePanel();
  }

  closePanel(){
    this.closePanel$.emit();
  }

  hoverOnDisaster(disaster: Disaster){
    this.hoverDisaster$.emit(disaster);
  }

  senseOfOrder(filter: string): string {
    const f = this.filters.find(f => f.name == filter);
    if(f != null){
      return f.order;
    }
    return 'ASC';
  }

  orderBy(filter: string){
    this.currentFilter = filter;
    this.currentOrder = (this.filters.find(f => f.name == filter)?.order === 'ASC') ? 'DESC' : 'ASC';
    this.filters.forEach(f => {
      if(f.name == filter){
        f.order = this.currentOrder;
      }else{
        f.order = 'ASC';
      }
    });
    this.changePage(this.currentPage);
  }

  changePage(page: number){
      this.load = true;
      this.historyDisasters = [];
      this.alertApiService.getDisastersAlerts(this.alert!.id, page, this.currentFilter, this.currentOrder, this.filterCountry, this.filterCity, this.filterFrom, this.filterTo).subscribe((dAlertDto:DisasterAlertDto) => {
        dAlertDto.disasters.forEach(d => {
          switch (d.type) {
            case 'earthquake':
              this.historyDisasters.push(new Earthquake(d as DisasterFromAlertDtoEarthquake));
              break;
            case 'flood':
              this.historyDisasters.push(new Flood(d as DisasterFromAlertDtoFlood));
              break;
            case 'hurricane':
              this.historyDisasters.push(new Hurricane(d as DisasterFromAlertDtoHurricane));
              break;
            case 'eruption':
              this.historyDisasters.push(new Eruption(d as DisasterFromAlertDtoEruption));
              break;
          }
        });
        this.disastersToDisplay$.emit(this.historyDisasters)
        this.count = dAlertDto.count;

        this.load = false;
        this.currentPage = page;
        this.nbPage = Math.ceil(this.count / this.limit);

        this.updateComponent()
        $("#filterCountry").trigger("focus");

        if(!this.counted){
          this.allCount = this.count;
          this.counted = true;
        }
      });
  }

  /**
   * Update view
   */
  updateComponent(){
      this.cd.markForCheck();
  }

}
