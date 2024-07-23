import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { SourcedataComponent } from './sourcedata/sourcedata.component';
import { ClusterAnalyticsComponent } from './cluster-analytics.component';
import { LoaderModule } from 'src/app/loader/loader.module';


@NgModule({
  declarations: [
    ClusterAnalyticsComponent,
    SourcedataComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    ToastModule,
    TabViewModule,
    SelectButtonModule,
    HighchartsChartModule,
    CalendarModule,
    LoaderModule
  ]
})
export class ClusterAnalyticsModule { }
