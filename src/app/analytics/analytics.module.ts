import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { SankeyModule } from './sankey/sankey.module';
import { ExcesspowerModule } from './excesspower/excesspower.module';
import { PeakOffModule } from './peak-off/peak-off.module';
import { MeterhealthModule } from './meterhealth/meterhealth.module';
import { CalendarModule } from 'primeng/calendar';
import { LoaderModule } from '../loader/loader.module';
import { MeterEnergyConsumptionComponent } from './meter-energy-consumption/meter-energy-consumption.component';
import { PeakSessionComponent } from './peak-session/peak-session.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EnergyPredectionComponent } from './energy-predection/energy-predection.component';


@NgModule({
  declarations: [
    AnalyticsComponent,
    MeterEnergyConsumptionComponent,
    PeakSessionComponent,
    EnergyPredectionComponent,
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
    DropdownModule,
    ToastModule,
    TableModule,
    TabViewModule,
    CalendarModule,
    SankeyModule,
    ExcesspowerModule,
    PeakOffModule,
    MeterhealthModule,
    LoaderModule,
    HighchartsChartModule
  ],
  exports:[AnalyticsComponent]
})
export class AnalyticsModule { }
