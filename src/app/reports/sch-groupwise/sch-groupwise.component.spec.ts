import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchGroupwiseComponent } from './sch-groupwise.component';

describe('SchGroupwiseComponent', () => {
  let component: SchGroupwiseComponent;
  let fixture: ComponentFixture<SchGroupwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchGroupwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchGroupwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
