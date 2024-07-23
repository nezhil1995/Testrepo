import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PngcostComponent } from './pngcost.component';

describe('PngcostComponent', () => {
  let component: PngcostComponent;
  let fixture: ComponentFixture<PngcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PngcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PngcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
