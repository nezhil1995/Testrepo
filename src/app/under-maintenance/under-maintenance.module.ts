import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderMaintenanceComponent } from './under-maintenance.component';



@NgModule({
  declarations: [
    UnderMaintenanceComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[UnderMaintenanceComponent]
})
export class UnderMaintenanceModule { }
