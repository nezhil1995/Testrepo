import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterhealthComponent } from './meterhealth.component';

describe('MeterhealthComponent', () => {
  let component: MeterhealthComponent;
  let fixture: ComponentFixture<MeterhealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterhealthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterhealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
