import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeographyApiService } from 'src/app/Services/GeographyApi.service';
import { CityAdmin, CityAdminService } from 'src/app/Services/api/city-admin.service';
import { Country } from 'src/app/Model/Country';
import * as L from 'leaflet';

@Component({
  selector: 'app-admin-cities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cities.component.html'
})
export class AdminCitiesView implements OnInit {
  private geoService = inject(GeographyApiService);
  private cityAdminService = inject(CityAdminService);

  countries: Country[] = [];
  selectedCountryId: number | null = null;
  outOfGeometry: boolean = true;
  isLoading: boolean = false;

  cities: CityAdmin[] = [];
  selectedCity: CityAdmin | null = null;

  currentPage: number = 1;
  pageSize: number = 50;
  totalItems: number = 0;

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
    this.selectedCity = null;

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

    this.cities.forEach(city => {
      try {
        const geom = typeof city.geom === 'string' ? JSON.parse(city.geom) : city.geom;
        if (geom && geom.coordinates) {
          const [lng, lat] = geom.coordinates;

          const marker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: 'assets/images/svg/urbain.svg',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          })
            .bindTooltip(city.namefr)
            .on('click', () => this.selectCity(city));

          this.markersLayer.addLayer(marker);
          bounds.extend([lat, lng]);
        }
      } catch (e) {
        console.error('Error parsing geom for city', city.namefr, e);
      }
    });

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  selectCity(city: CityAdmin): void {
    this.selectedCity = city;
    this.editModel = {
      paysId: city.paysId,
      population: city.population || 0,
      altitude: city.altitude || 0,
      timezone: city.timezone || ''
    };
  }

  saveCity(): void {
    if (!this.selectedCity || !this.editModel.paysId) return;

    const updateData = {
      paysId: +this.editModel.paysId,
      population: this.editModel.population,
      altitude: this.editModel.altitude,
      timezone: this.editModel.timezone
    };

    this.cityAdminService.updateCity(this.selectedCity.id, updateData).subscribe({
      next: () => {
        alert('Ville mise à jour avec succès');
        // Refresh the list
        this.onFilterChange();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour de la ville');
      }
    });
  }
}
