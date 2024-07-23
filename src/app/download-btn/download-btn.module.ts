import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadBtnComponent } from './download-btn.component';



@NgModule({
  declarations: [
    DownloadBtnComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[DownloadBtnComponent]
})
export class DownloadBtnModule { }
