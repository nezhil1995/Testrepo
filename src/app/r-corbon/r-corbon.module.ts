import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RCorbonComponent } from './r-corbon.component';

import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TmNgOdometerModule } from 'tm-ng-odometer';
import { NgApexchartsModule  } from 'ng-apexcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { TabViewModule } from 'primeng/tabview';
import { AnalyticsModule } from './analytics/analytics.module';
import { TooltipModule } from 'primeng/tooltip';
import { SankeyModule } from './sankey/sankey.module';
import { SummaryComponent } from './summary/summary.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    RCorbonComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    BrowserModule,
    InputTextModule,
    ReactiveFormsModule,
    CalendarModule,
    DialogModule,
    TmNgOdometerModule,
    NgApexchartsModule,
    HighchartsChartModule,
    TabViewModule,
    AnalyticsModule,
    TooltipModule,
    SankeyModule,
    LoaderModule
  ],
  exports: [RCorbonComponent]
})
export class RCorbonModule { }
