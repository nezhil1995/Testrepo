import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterheatmapComponent } from './meterheatmap.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { NgApexchartsModule } from "ng-apexcharts";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoaderModule } from 'src/app/loader/loader.module';


@NgModule({
  declarations: [
    MeterheatmapComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    BrowserAnimationsModule,
    CalendarModule,
    NgApexchartsModule,
    FontAwesomeModule,
    LoaderModule
  ],
  exports:[MeterheatmapComponent]
})
export class MeterheatmapModule { }
