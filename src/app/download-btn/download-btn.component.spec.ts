import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadBtnComponent } from './download-btn.component';

describe('DownloadBtnComponent', () => {
  let component: DownloadBtnComponent;
  let fixture: ComponentFixture<DownloadBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
