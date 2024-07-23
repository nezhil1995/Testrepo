import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarcostComponent } from './solarcost.component';

describe('SolarcostComponent', () => {
  let component: SolarcostComponent;
  let fixture: ComponentFixture<SolarcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
