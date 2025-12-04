import { TestBed } from '@angular/core/testing';

import { TheColorAPI } from './the-color-api';

describe('TheColorAPI', () => {
  let service: TheColorAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheColorAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
