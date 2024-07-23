import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskloaderComponent } from './maskloader.component';

@NgModule({
  declarations: [
    MaskloaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[MaskloaderComponent]
})
export class MaskloaderModule { }
