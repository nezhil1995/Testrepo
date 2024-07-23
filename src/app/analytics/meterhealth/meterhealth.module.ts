import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterhealthComponent } from './meterhealth.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgApexchartsModule } from "ng-apexcharts";
import { LoaderModule } from 'src/app/loader/loader.module';
import { UnderMaintenanceModule } from 'src/app/under-maintenance/under-maintenance.module';

@NgModule({
  declarations: [
    MeterhealthComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgApexchartsModule,
    LoaderModule,
    UnderMaintenanceModule
  ],
  exports:[MeterhealthComponent]
})
export class MeterhealthModule { }
