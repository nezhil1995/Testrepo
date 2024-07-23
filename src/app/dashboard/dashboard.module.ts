import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { OrganizationChartModule } from 'primeng/organizationchart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DashboardComponent } from './dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TmNgOdometerModule } from 'tm-ng-odometer';
import { CalendarModule } from 'primeng/calendar';
import { LoaderModule } from '../loader/loader.module';
import { NavDashboardModule } from '../nav-dashboard/nav-dashboard.module';
import { DownloadBtnModule } from '../download-btn/download-btn.module';
import { TryAgainModule } from '../try-again/try-again.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { UnderMaintenanceModule } from '../under-maintenance/under-maintenance.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    DashboardComponent,
  ],
  providers: [MessageService],
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
    OrganizationChartModule,
    ToastModule,
    TmNgOdometerModule,
    CalendarModule,
    HighchartsChartModule,
    LoaderModule,
    NavDashboardModule,
    DownloadBtnModule,
    TryAgainModule,
    SelectButtonModule,
    MultiSelectModule,
    UnderMaintenanceModule
  ],
  exports:[DashboardComponent]
})
export class DashboardModule { }
