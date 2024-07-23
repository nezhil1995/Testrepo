import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KvacostComponent } from './kvacost.component';

describe('KvacostComponent', () => {
  let component: KvacostComponent;
  let fixture: ComponentFixture<KvacostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KvacostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KvacostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
