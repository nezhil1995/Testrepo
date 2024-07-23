import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupdiaComponent } from './groupdia.component';

describe('GroupdiaComponent', () => {
  let component: GroupdiaComponent;
  let fixture: ComponentFixture<GroupdiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupdiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupdiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
