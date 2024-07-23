import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchMeterwiseComponent } from './sch-meterwise.component';

describe('SchMeterwiseComponent', () => {
  let component: SchMeterwiseComponent;
  let fixture: ComponentFixture<SchMeterwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchMeterwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchMeterwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
