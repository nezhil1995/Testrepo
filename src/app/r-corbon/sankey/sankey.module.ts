import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyComponent } from './sankey.component';

import { BrowserAnimationsModule, } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    SankeyComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgxEchartsModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ],

  exports:[SankeyComponent]
})

export class SankeyModule { }
