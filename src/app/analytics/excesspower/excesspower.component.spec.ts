import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcesspowerComponent } from './excesspower.component';

describe('ExcesspowerComponent', () => {
  let component: ExcesspowerComponent;
  let fixture: ComponentFixture<ExcesspowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcesspowerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcesspowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
