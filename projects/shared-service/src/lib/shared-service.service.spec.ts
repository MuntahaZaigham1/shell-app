import { TestBed } from '@angular/core/testing';

import { SharedNavigationService } from './shared-navigation.service';

describe('SharedServiceService', () => {
  let service: SharedNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
