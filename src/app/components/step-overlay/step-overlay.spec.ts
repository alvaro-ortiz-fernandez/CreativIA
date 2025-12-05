import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOverlay } from './step-overlay';

describe('StepOverlay', () => {
  let component: StepOverlay;
  let fixture: ComponentFixture<StepOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
