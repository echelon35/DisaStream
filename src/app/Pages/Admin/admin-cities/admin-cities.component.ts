import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeographyApiService } from 'src/app/Services/GeographyApi.service';
import { AdminService, CityAdmin } from 'src/app/Services/Admin.service';
import { Country } from 'src/app/Model/Country';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { MarkerService } from 'src/app/Map/Services/marker.service';
import { ToastrService } from 'src/app/Shared/Services/Toastr.service';

@Component({
  selector: 'app-admin-cities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cities.component.html'
})
export class AdminCitiesView implements OnInit {
  private geoService = inject(GeographyApiService);
  private adminService = inject(AdminService);
  private markerService = inject(MarkerService);
  #toastrService = inject(ToastrService);

  countries: Country[] = [];
  selectedCountryId: number | null = null;
  outOfGeometry: boolean = true;
  isLoading: boolean = false;

  cities: CityAdmin[] = [];
  selectedCities: CityAdmin[] = [];
  isMultiSelectMode: boolean = false;

  currentPage: number = 1;
  pageSize: number = 50;
  totalItems: number = 0;

  cityInErrors: CityAdmin[] = [];
  totalCitiesNumber = 0;

  private map: L.Map | undefined;
  private markersLayer = new L.LayerGroup();

  editModel = {
    paysId: null as number | null,
    population: 0,
    altitude: 0,
    timezone: ''
  };

  isEditingCountry: boolean = false;
  countryLayer: L.GeoJSON | null = null;
  selectedCountry: Country | null = null;
  editCountryModel = {
    population: 0,
    superficie: 0,
    wikilink: '',
    trigramme: '',
    iso3166_2: ''
  };

  ngOnInit(): void {
    this.geoService.getCountries().subscribe((countries) => {
      this.countries = countries.sort((a, b) => a.namefr.localeCompare(b.namefr));
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('cities-map').setView([46.2276, 2.2137], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  onFilterChange(resetPage: boolean = true): void {
    if (!this.selectedCountryId) return;

    if (resetPage) {
      this.currentPage = 1;
    }

    this.isLoading = true;
    this.selectedCities = [];
    this.isEditingCountry = false;

    // Load Country Shape
    this.adminService.getCountry(this.selectedCountryId).subscribe({
      next: (country) => {
        this.selectedCountry = country;
        this.renderCountryShape(country);
      },
      error: (e) => console.error('Failed to load country', e)
    });

    this.adminService.getCitiesByCountry(this.selectedCountryId, this.outOfGeometry, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.cities = response.data;
          this.totalItems = response.total;
          this.updateMapMarkers();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });

    this.adminService.getCitiesCount(this.selectedCountryId).subscribe({
      next: (res) => {
        this.totalCitiesNumber = res.total;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du nombre total de villes', err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onFilterChange(false);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onFilterChange(false);
    }
  }

  private updateMapMarkers(): void {
    if (!this.map) return;
    this.markersLayer.clearLayers();

    if (this.cities.length === 0) return;

    const bounds = L.latLngBounds([]);

    this.cities.forEach((city: CityAdmin) => {
      try {


        const marker = this.markerService.makeCityAdminMarkers(city)!
          .bindTooltip(city.namefr)
          .on('click', (e: L.LeafletMouseEvent) => this.selectCity(city, e));

        this.markersLayer.addLayer(marker);
        const lat = marker.getLatLng().lat;
        const lng = marker.getLatLng().lng;
        bounds.extend([lat, lng]);
      } catch (e) {
        console.error('Erreur de chargement de la ville', city.namefr, e);
        this.cityInErrors.push(city);
      }
    });

    if (bounds.isValid() && !this.selectedCountry) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private renderCountryShape(country: Country): void {
    if (!this.map) return;
    if (this.countryLayer) {
      this.countryLayer.remove();
      this.countryLayer = null;
    }

    if (!country.geom) return;

    try {
      const geom = typeof country.geom === 'string' ? JSON.parse(country.geom) : country.geom;
      this.countryLayer = L.geoJSON(geom, {
        style: {
          color: '#4B5563', // gray-600
          weight: 2,
          opacity: 0.5,
          fillColor: '#9CA3AF',
          fillOpacity: 0.1
        }
      }).addTo(this.map);

      this.map.fitBounds(this.countryLayer.getBounds(), { padding: [20, 20] });
    } catch (e) {
      console.error('Error parsing country shape', e);
    }
  }

  toggleEditCountry(): void {
    if (!this.selectedCountry || !this.countryLayer) return;

    this.deselectAll();
    this.isEditingCountry = true;
    this.editCountryModel = {
      population: this.selectedCountry.population || 0,
      superficie: this.selectedCountry.superficie || 0,
      wikilink: this.selectedCountry.wikilink || '',
      trigramme: this.selectedCountry.trigramme || '',
      iso3166_2: this.selectedCountry.iso3166_2 || ''
    };

    // Bring to front and styling to editing mode
    this.countryLayer.bringToFront();
    this.countryLayer.setStyle({
      color: '#EF4444', // red-500
      weight: 3,
      opacity: 0.8,
      fillColor: '#EF4444',
      fillOpacity: 0.2
    });

    // Enable Leaflet-Geoman editing
    this.countryLayer.pm.enable({
      allowSelfIntersection: false
    });
  }

  cancelEditCountry(): void {
    this.isEditingCountry = false;
    if (this.countryLayer) {
      this.countryLayer.pm.disable();
    }
    // Re-render original shape
    if (this.selectedCountry) {
      this.renderCountryShape(this.selectedCountry);
    }
  }

  saveCountry(): void {
    if (!this.selectedCountry || !this.countryLayer) return;

    const modifiedGeoJson: any = this.countryLayer.toGeoJSON();
    // leaflet layer toGeoJSON can return Feature or FeatureCollection. We just want the geometry.
    const geometry = modifiedGeoJson.features ? modifiedGeoJson.features[0].geometry : modifiedGeoJson.geometry || modifiedGeoJson;

    const updateData = {
      population: this.editCountryModel.population,
      superficie: this.editCountryModel.superficie,
      wikilink: this.editCountryModel.wikilink,
      trigramme: this.editCountryModel.trigramme,
      iso3166_2: this.editCountryModel.iso3166_2,
      geom: JSON.stringify(geometry)
    };

    this.adminService.updateCountry(this.selectedCountry.id, updateData).subscribe({
      next: (res) => {
        this.#toastrService.success('Pays mis à jour avec succès');
        this.selectedCountry = res;
        this.cancelEditCountry();
      },
      error: (e) => {
        console.error(e);
        this.#toastrService.error('Erreur lors de la mise à jour du pays');
      }
    });
  }

  selectCity(city: CityAdmin, event?: L.LeafletMouseEvent): void {
    const isMultiSelectAction = this.isMultiSelectMode || (event && (event.originalEvent.shiftKey || event.originalEvent.ctrlKey));

    if (isMultiSelectAction) {
      const idx = this.selectedCities.findIndex(c => c.id === city.id);
      if (idx > -1) {
        // Deselect if already selected
        this.selectedCities.splice(idx, 1);
      } else {
        // Add to selection
        this.selectedCities.push(city);
      }
    } else {
      // Single select mode
      this.selectedCities = [city];
    }

    this.updateEditModel();
  }

  deselectAll(): void {
    this.selectedCities = [];
    this.updateEditModel();
  }

  private updateEditModel(): void {
    if (this.selectedCities.length === 0) {
      this.editModel = { paysId: null, population: 0, altitude: 0, timezone: '' };
      return;
    }

    if (this.selectedCities.length === 1) {
      const city = this.selectedCities[0];
      this.editModel = {
        paysId: city.paysId,
        population: city.population || 0,
        altitude: city.altitude || 0,
        timezone: city.timezone || ''
      };
    } else {
      // Multiple selected: initialize with empty values unless they share the same value
      const firstCity = this.selectedCities[0];
      const allSamePaysId = this.selectedCities.every(c => c.paysId === firstCity.paysId);
      const allSameTz = this.selectedCities.every(c => c.timezone === firstCity.timezone);

      this.editModel = {
        paysId: allSamePaysId ? firstCity.paysId : null,
        population: 0,
        altitude: 0,
        timezone: allSameTz ? (firstCity.timezone || '') : ''
      };
    }
  }

  saveCity(): void {
    if (this.selectedCities.length === 0 || !this.editModel.paysId) return;

    if (this.selectedCities.length === 1) {
      // Single update
      const updateData = {
        paysId: +this.editModel.paysId,
        population: this.editModel.population,
        altitude: this.editModel.altitude,
        timezone: this.editModel.timezone
      };

      this.adminService.updateCity(this.selectedCities[0].id, updateData).subscribe({
        next: () => {
          this.#toastrService.success('Ville mise à jour avec succès');
          this.onFilterChange(false);
        },
        error: (err) => {
          console.error(err);
          this.#toastrService.error('Erreur lors de la mise à jour de la ville');
        }
      });
    } else {
      // Bulk update
      const updateData: Partial<CityAdmin> = {
        paysId: +this.editModel.paysId
      };

      if (this.editModel.timezone) {
        updateData.timezone = this.editModel.timezone;
      }

      const cityIds = this.selectedCities.map(c => c.id);

      this.adminService.updateMultipleCities(cityIds, updateData).subscribe({
        next: (res) => {
          this.#toastrService.success(`Mise à jour groupée de ${res.affected} villes avec succès`);
          this.onFilterChange(false);
        },
        error: (err) => {
          console.error(err);
          this.#toastrService.error('Erreur lors de la mise à jour groupée');
        }
      });
    }
  }
}
