import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchGroupwiseComponent } from './sch-groupwise.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoaderModule } from 'src/app/loader/loader.module';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    SchGroupwiseComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    LoaderModule,
    CalendarModule
  ],
  exports:[SchGroupwiseComponent]
})
export class SchGroupwiseModule { }
