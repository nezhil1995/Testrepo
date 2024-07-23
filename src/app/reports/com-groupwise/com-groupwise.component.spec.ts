import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComGroupwiseComponent } from './com-groupwise.component';

describe('ComGroupwiseComponent', () => {
  let component: ComGroupwiseComponent;
  let fixture: ComponentFixture<ComGroupwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComGroupwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComGroupwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
