import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CngcostComponent } from './cngcost.component';

describe('CngcostComponent', () => {
  let component: CngcostComponent;
  let fixture: ComponentFixture<CngcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CngcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CngcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
