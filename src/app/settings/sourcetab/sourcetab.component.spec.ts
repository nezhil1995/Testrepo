import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcetabComponent } from './sourcetab.component';

describe('SourcetabComponent', () => {
  let component: SourcetabComponent;
  let fixture: ComponentFixture<SourcetabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcetabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourcetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
