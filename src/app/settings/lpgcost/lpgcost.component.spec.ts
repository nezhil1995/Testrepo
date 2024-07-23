import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpgcostComponent } from './lpgcost.component';

describe('LpgcostComponent', () => {
  let component: LpgcostComponent;
  let fixture: ComponentFixture<LpgcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpgcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LpgcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
