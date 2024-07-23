import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakOffComponent } from './peak-off.component';

describe('PeakOffComponent', () => {
  let component: PeakOffComponent;
  let fixture: ComponentFixture<PeakOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeakOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeakOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
