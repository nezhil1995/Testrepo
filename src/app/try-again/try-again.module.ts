import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TryAgainComponent } from './try-again.component';



@NgModule({
  declarations: [
    TryAgainComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[TryAgainComponent]
})
export class TryAgainModule { }
