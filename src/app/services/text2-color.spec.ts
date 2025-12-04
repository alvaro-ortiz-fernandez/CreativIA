import { TestBed } from '@angular/core/testing';

import { Text2Color } from './text2-color';

describe('Text2Color', () => {
  let service: Text2Color;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Text2Color);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
