import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterwiseComponent } from './meterwise.component';

describe('MeterwiseComponent', () => {
  let component: MeterwiseComponent;
  let fixture: ComponentFixture<MeterwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
