import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComGroupwiseComponent } from './com-groupwise.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/loader/loader.module';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ComGroupwiseComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    CalendarModule
  ],
  exports:[ComGroupwiseComponent]
})
export class ComGroupwiseModule { }
