import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectableComponent } from './sectable.component';

describe('SectableComponent', () => {
  let component: SectableComponent;
  let fixture: ComponentFixture<SectableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
