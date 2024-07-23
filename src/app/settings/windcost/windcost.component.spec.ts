import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindcostComponent } from './windcost.component';

describe('WindcostComponent', () => {
  let component: WindcostComponent;
  let fixture: ComponentFixture<WindcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
