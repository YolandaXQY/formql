import { TestBed } from '@angular/core/testing';

import { DynamicFormqlService } from './dynamic-formql.service';

describe('DynamicFormqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicFormqlService = TestBed.get(DynamicFormqlService);
    expect(service).toBeTruthy();
  });
});
