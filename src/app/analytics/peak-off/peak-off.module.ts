import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeakOffComponent } from './peak-off.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { LoaderModule } from 'src/app/loader/loader.module';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    PeakOffComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    LoaderModule,
    CalendarModule
  ],
  exports:[PeakOffComponent]
})
export class PeakOffModule { }
