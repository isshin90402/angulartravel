import { TestBed } from '@angular/core/testing';

import { SabreService } from './sabre.service';

describe('SabreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SabreService = TestBed.get(SabreService);
    expect(service).toBeTruthy();
  });
});
