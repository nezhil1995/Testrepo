import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterEnergyConsumptionComponent } from './meter-energy-consumption.component';

describe('MeterEnergyConsumptionComponent', () => {
  let component: MeterEnergyConsumptionComponent;
  let fixture: ComponentFixture<MeterEnergyConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterEnergyConsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterEnergyConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
