import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperclusterDashboardComponent } from './supercluster-dashboard.component';

import { CarouselModule } from 'primeng/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FieldsetModule } from 'primeng/fieldset';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartviewComponent } from './chartview/chartview.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HighchartsChartModule } from 'highcharts-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgApexchartsModule } from "ng-apexcharts";
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    SuperclusterDashboardComponent,
    ChartviewComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    CarouselModule,
    FieldsetModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
    HttpClientModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SelectButtonModule,
    HighchartsChartModule,
    MultiSelectModule,
    NgApexchartsModule,
    LoaderModule
  ],
  exports:[
    SuperclusterDashboardComponent
  ]
})
export class SuperclusterDashboardModule { }
