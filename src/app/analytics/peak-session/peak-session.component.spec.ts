import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakSessionComponent } from './peak-session.component';

describe('PeakSessionComponent', () => {
  let component: PeakSessionComponent;
  let fixture: ComponentFixture<PeakSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeakSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeakSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
