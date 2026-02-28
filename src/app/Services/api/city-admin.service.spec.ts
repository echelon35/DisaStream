import { TestBed } from '@angular/core/testing';

import { CityAdminService } from './city-admin.service';

describe('CityAdminService', () => {
  let service: CityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
