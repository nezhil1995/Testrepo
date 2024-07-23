import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantdialogComponent } from './plantdialog.component';

describe('PlantdialogComponent', () => {
  let component: PlantdialogComponent;
  let fixture: ComponentFixture<PlantdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
