import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSpinner } from './btn-spinner';

describe('BtnSpinner', () => {
  let component: BtnSpinner;
  let fixture: ComponentFixture<BtnSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnSpinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
