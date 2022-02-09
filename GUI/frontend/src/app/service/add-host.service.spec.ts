import { TestBed } from '@angular/core/testing';

import { AddHostService } from './add-host.service';

describe('AddHostService', () => {
  let service: AddHostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
