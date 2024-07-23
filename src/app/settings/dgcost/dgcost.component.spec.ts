import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgcostComponent } from './dgcost.component';

describe('DgcostComponent', () => {
  let component: DgcostComponent;
  let fixture: ComponentFixture<DgcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DgcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
