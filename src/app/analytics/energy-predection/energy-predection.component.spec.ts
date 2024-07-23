import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyPredectionComponent } from './energy-predection.component';

describe('EnergyPredectionComponent', () => {
  let component: EnergyPredectionComponent;
  let fixture: ComponentFixture<EnergyPredectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyPredectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyPredectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
