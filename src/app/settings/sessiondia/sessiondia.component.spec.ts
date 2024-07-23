import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessiondiaComponent } from './sessiondia.component';

describe('SessiondiaComponent', () => {
  let component: SessiondiaComponent;
  let fixture: ComponentFixture<SessiondiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessiondiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessiondiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
