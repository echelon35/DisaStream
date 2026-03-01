import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeographyApiService } from 'src/app/Services/GeographyApi.service';
import { CityAdmin, CityAdminService } from 'src/app/Services/api/city-admin.service';
import { Country } from 'src/app/Model/Country';
import * as L from 'leaflet';
import { MarkerService } from 'src/app/Map/Services/marker.service';

@Component({
  selector: 'app-admin-cities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cities.component.html'
})
export class AdminCitiesView implements OnInit {
  private geoService = inject(GeographyApiService);
  private cityAdminService = inject(CityAdminService);
  private markerService = inject(MarkerService);

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

  // Form model for editing
  editModel = {
    paysId: null as number | null,
    population: 0,
    altitude: 0,
    timezone: ''
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

    this.cityAdminService.getCitiesByCountry(this.selectedCountryId, this.outOfGeometry, this.currentPage, this.pageSize)
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

    this.cityAdminService.getCitiesCount(this.selectedCountryId).subscribe({
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

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
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

      this.cityAdminService.updateCity(this.selectedCities[0].id, updateData).subscribe({
        next: () => {
          alert('Ville mise à jour avec succès');
          this.onFilterChange(false);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour de la ville');
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

      this.cityAdminService.updateMultipleCities(cityIds, updateData).subscribe({
        next: (res) => {
          alert(`Mise à jour groupée de ${res.affected} villes avec succès`);
          this.onFilterChange(false);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour groupée');
        }
      });
    }
  }
}
