import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatercostComponent } from './watercost.component';

describe('WatercostComponent', () => {
  let component: WatercostComponent;
  let fixture: ComponentFixture<WatercostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatercostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatercostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
