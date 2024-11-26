import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewChild, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import { Subject } from "rxjs";
import { Alea } from "src/app/Model/Alea";
import { Alert } from "src/app/Model/Alert";
import { MailAlert } from "src/app/Model/MailAlert";
import { AlertApiService } from "src/app/Services/AlertApiService";
import { ToastrService } from "src/app/Shared/Services/Toastr.service";
import { AddMailAlert } from "src/app/Modals/AddMailAlert/AddMailAlert.modal";
import { AleaCategoryDto } from "src/app/DTO/AleaCategory.dto";
import { PublicApiService } from "src/app/Services/PublicApi.service";
import { GeographyApiService } from "src/app/Services/GeographyApi.service";
import { ShapeService } from "src/app/Map/Services/shape.service";
import { EndAlertComponent } from "src/app/Modals/EndAlert/EndAlert.modal";

class AleaVM {
  alea: Alea;
  selected = false;

  constructor(alea: Alea){
      this.alea = alea;
  }
}

class AleaCategoryVM {
  category = "";
  aleas: AleaVM[] = [];
}

@Component({
    templateUrl: './NewAlert.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewAlertView {
  
    private _formBuilder = inject(FormBuilder);

    public alert: Alert = new Alert();
    public loadedAlert: Subject<Alert> = new Subject<Alert>();
    panelVisible = true;
    editShape = false;

    public categories: AleaCategoryVM[] = [];
    public selectedAleaTypes: Alea[] = [];

    //Change detector to update component manually
    private cd = inject(ChangeDetectorRef)

    editMode = false;

    //Area
    areaMap?: L.Map;
    actualLayer?: L.GeoJSON;
    countriesLayer?: L.GeoJSON = new L.GeoJSON(null);
    public locationBox?: L.LatLngBounds;

    //team
    public mailAlerts: MailAlert[] = [];
    selectedMailIds: number[] = [];
    
    @ViewChild('mailAlertModal') mailAlertModal?: AddMailAlert;
    @ViewChild('endAlertModal') endAlertModal?: EndAlertComponent;

    formGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    constructor(private alertApiService: AlertApiService, 
      private router: Router, 
      private route: ActivatedRoute, 
      private toastrService: ToastrService,
      private publicApiService: PublicApiService,
      private shapeService: ShapeService,
      private geographyService: GeographyApiService){

      this.getAleas();
      this.getTeamMembersMail();

      //Edit alert
      if(this.route.snapshot.queryParamMap.get('id') != null){
        this.editMode = true;
        const id = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.alertApiService.getAlertById(id).subscribe({
          next: (alert) => {

            console.log(alert);
            this.alert = alert;

            //feed area
            const geo = new L.GeoJSON(alert.areas);
            this.actualLayer?.addLayer(geo);
            this.addShapeToMap();

            //feed alea selected
            this.categories.forEach(item => item.aleas.forEach(aleaVM => {
              if(this.alert.aleas.find(alea => alea.name == aleaVM.alea.name)){
                  aleaVM.selected = true;
              }
            }))

            //feed team users
            this.selectedMailIds = (this.alert.mailAlerts) ? this.alert.mailAlerts.map(x => x.id) : [];
            this.updateComponent();
          },
          error: (error) => { 
            if(error.status == 403){
              this.router.navigateByUrl('dashboard/alerts/manage').then(() => { this.toastrService.error('Vous n\'êtes pas autorisé à accéder à cette alerte'); 
            })}
            else {
              this.toastrService.error(error?.message);
            }
          }
        })
      }
      
    }

    /**
     * Show side panel to make alert
     */
    showPanel(){
      this.panelVisible = !this.panelVisible;
      if(this.panelVisible && this.areaMap != null){
        this.areaMap!.pm.disableGlobalEditMode();
      }
    }

    /*********************AREA*************************/

    /**
     * Receive map from the map component
     * @param map 
     */
    receiveMap(map: L.Map) {
      this.areaMap = map;
    }
    
    /**
     * Receive layer from the map component
     * @param layer 
     */
    receiveLayer(layer: L.LayerGroup) {
        this.actualLayer = new L.GeoJSON(null,{
            style: {
                fillColor: '#6a5ac7'
            }
        });
        if(this.areaMap !== undefined){
            this.actualLayer!.addTo(this.areaMap);
            this.actualLayer?.bringToFront()
            this.areaMap.pm.setGlobalOptions({
                layerGroup: this.actualLayer,
            });
            this.areaMap.on('pm:create', this.addShapeToMap, this);
        }
    }

    /**
     * Hide countries and show panel after country selection
     */
    hideCountries(){
      this.countriesLayer?.removeFrom(this.areaMap!);
      if(!this.panelVisible){
        this.showPanel();
      }
    }

    /**
     * Show countries on map
     */
    showCountries(){
      if(this.countriesLayer?.getLayers().length == 0){
        this.getCountries();
      }
      else{
        this.countriesLayer?.addTo(this.areaMap!);
      }
      if(this.panelVisible){
        this.showPanel();
      }
    }

    /**
     * Get countries and add them on map
     */
    getCountries(){
      this.geographyService.getCountries().subscribe(countries => {
        countries.forEach(country => {
          this.shapeService.makeCountriesShape(this.areaMap!,this.countriesLayer!,country, this.clickOnCountry, this);
        })
      });
    }

    /**
     * Country selection
     * @param e 
     */
    clickOnCountry(e){
      const geometry = (e.sourceTarget?.feature?.geometry);
      const idCountry = (e.sourceTarget?.feature?.properties?.id);
      this.deleteArea();
      if(this.actualLayer != null && geometry != null){
          const geo = new L.GeoJSON(geometry);
          this.actualLayer?.addLayer(geo);
          this.actualLayer?.addTo(this.areaMap!)
          const collection = this.actualLayer?.toGeoJSON() as FeatureCollection;
          this.alert.areas = collection?.features[0]?.geometry;
          this.alert.countryId = idCountry;
          this.alert.isCountryShape = true;
      }
      this.hideCountries();
    }

    /**
     * Quit edit mode with esc key
     */
    @HostListener('keydown.esc', ['$event'])
    onEsc() {
      if(this.areaMap != null){
        this.areaMap.pm.disableDraw();
        if(!this.panelVisible){
          this.showPanel();
        }
      }
    }

    /**
     * Draw polygon form by clicking the button
     */
    drawPolygon(): void {
      this.hideCountries()
      if(this.areaMap !== undefined){
          if(this.panelVisible){
            this.showPanel();
          }
          // new L.Draw.Polygon(this.areaMap as (L.DrawMap), { shapeOptions: { stroke: true, fillColor: '#6a5ac7' }}).enable();
          this.areaMap.pm.enableDraw("Polygon", {
              snappable: true,
              snapDistance: 5,
          });
      }
    }

    /**
     * Delete area
     */
    deleteArea(){
      this.actualLayer?.clearLayers();
      this.alert.isCountryShape = false;
      this.alert.areas = null;
      this.alert.countryId = null;
    }

    /**
     * Edit custom area
     */
    editArea(){
      this.showPanel();
      this.areaMap!.pm.enableGlobalEditMode({
        snappable: true,
        snapDistance: 50
      });
    }

    
    /**
     * After adding shape (polygon or circle) by button
     * @param e 
     */
    addShapeToMap(){

      if(this.areaMap != null){

        this.actualLayer?.setStyle({weight: 3,fillColor:'#ffffff', color:'white'});
        this.actualLayer?.addTo(this.areaMap!);

        // this.areaMap!.pm.disableDraw();
        // this.areaMap!.pm.enableGlobalEditMode({
        //     snappable: true,
        //     snapDistance: 50
        // });

        if(this.actualLayer != null){
          const collection = this.actualLayer?.toGeoJSON() as FeatureCollection;
          this.alert.areas = collection?.features[0]?.geometry;
        }
  
        if(!this.panelVisible){
          this.showPanel();
        }
      }
    }

    /*********************ALEAS*************************/

    /**
     * Select alea to monitor
     * @param alea 
     */
    selectAlea(alea: AleaVM){
      alea.selected = !alea.selected;
      this.alert.aleas = [];
      this.categories.forEach(item => item.aleas.forEach(aleaVM => {
          if(aleaVM.selected){
              this.alert.aleas.push(aleaVM.alea);
          }
      }))
    }

    /**
     * 
     */
    getAleas(){
      this.publicApiService.getAleasByCategory().subscribe((v) => {
          const aleasByCategory: AleaCategoryVM[] = [];
          v.forEach((item) => {
            const aleaCategoryDto = item as AleaCategoryDto;
            if(!aleasByCategory.find((cat) => aleaCategoryDto.category_name == (cat as AleaCategoryVM).category)){
              aleasByCategory.push({
                    category: aleaCategoryDto.category_name,
                    aleas: [{
                      alea: {
                          id: aleaCategoryDto.alea_id,
                          name: aleaCategoryDto.alea_name,
                          label: aleaCategoryDto.alea_label,
                      },
                      selected: false,
                    }]
                })
            }
            else{
              aleasByCategory.find((cat) => (cat as AleaCategoryVM).category == aleaCategoryDto.category_name)?.aleas.push({
                alea: {
                id: aleaCategoryDto.alea_id,
                name: aleaCategoryDto.alea_name,
                label: aleaCategoryDto.alea_label,
              },
              selected: false,
              });
            }
          })
          this.categories = aleasByCategory;
          this.updateComponent();
      })
    }

    /*********************TEAM MEMBERS*************************/

    /**
     * Checked property of input alert mail checkbox
     * @param id 
     * @returns 
     */
    isAlertMailChecked(id: number): boolean {
      return this.selectedMailIds.includes(id);
    }
    
    /**
     * Select team mates to alert
     * @param event 
     */
    selectMailUser(event){
      const mailId = parseInt(event.target.value);
      if(event.target.checked){
        this.selectedMailIds.push(mailId);
      }
      else{
        let i = 0;
        this.selectedMailIds.forEach((id: number) => {
          if(id === mailId) {
            this.selectedMailIds.splice(i,1);
            return;
          }
    
          i++;
        });
      }
      this.alert.mailAlerts = this.mailAlerts.filter(x => this.selectedMailIds.some((n) => n === x.id))
    }

    /**
     * Add another team mate
     */
    addTeamMember(){
      this.mailAlertModal?.open();
    }

    /**
     * Refresh team members after adding one from modal
     */
    getTeamMembersMail(){
      this.alertApiService.getMailAlerts().subscribe((ma) => {
        this.mailAlerts = ma;
        this.updateComponent();
      })
    }

    /**
     * Update view
     */
    updateComponent(){
      this.cd.markForCheck();
    }

    createAlert(){
      this.endAlertModal?.open();
      if(this.formGroup.value.name != null){
        this.alert.name = this.formGroup.value.name;
      }
      if(this.alert.name == '' || this.alert.name == null){
        this.toastrService.error('Alerte incomplète','Vous devez donner un nom à votre alerte');
        return;
      }
      else if(this.alert.aleas.length === 0){
        this.toastrService.error('Alerte incomplète','Vous devez selectionner au moins un type d\'aléa à surveiller');
        return;
      }
      else if(this.alert.mailAlerts.length === 0){
        this.toastrService.error('Alerte incomplète','Vous devez selectionner au moins une personne à qui envoyer l\'adresse');
        return;
      }

      console.log(this.alert);
      this.endAlertModal?.open();
      this.endAlertModal?.createAlert();

      // prévenir l'utilisateur sil n'a pas selectionné de zone que la
      // zone applicable est le monde entier et que cela peut le spammer (au moins s'il a selectionné les séismes)

    }
}