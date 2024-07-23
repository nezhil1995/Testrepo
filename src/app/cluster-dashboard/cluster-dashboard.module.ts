import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterDashboardComponent } from './cluster-dashboard.component';
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
import { MaskloaderModule } from '../maskloader/maskloader.module';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { JoyrideModule } from 'ngx-joyride';
import { ClusterAnalyticsModule } from '../cluster-analytics/cluster-analytics.module';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    ClusterDashboardComponent,
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
    MaskloaderModule,
    DividerModule,
    ConfirmDialogModule,
    HighchartsChartModule,
    CalendarModule,
    ClusterAnalyticsModule,
    JoyrideModule.forRoot(),
    LoaderModule
  ],
  exports: [ClusterDashboardComponent]
})
export class ClusterDashboardModule {}
