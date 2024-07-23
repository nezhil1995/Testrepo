import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComMeterwiseComponent } from './com-meterwise.component';

describe('ComGroupwiseComponent', () => {
  let component: ComMeterwiseComponent;
  let fixture: ComponentFixture<ComMeterwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComMeterwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComMeterwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
