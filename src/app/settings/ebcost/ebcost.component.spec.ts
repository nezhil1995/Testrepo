import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbcostComponent } from './ebcost.component';

describe('EbcostComponent', () => {
  let component: EbcostComponent;
  let fixture: ComponentFixture<EbcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
