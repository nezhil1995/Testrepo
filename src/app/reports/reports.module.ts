import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReportsComponent } from './reports.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MeterwiseModule } from './meterwise/meterwise.module';
import { HistoricalModule } from './historical/historical.module';
import { SchGroupwiseModule } from './sch-groupwise/sch-groupwise.module';
import { ComGroupwiseModule } from './com-groupwise/com-groupwise.module';
import { SchMeterwiseModule } from './sch-meterwise/sch-meterwise.module';
import { MeterheatmapModule } from './meterheatmap/meterheatmap.module';
import { ComMeterwiseModule } from './com-meterwise/com-meterwise.module'
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    TableModule,
    ConfirmDialogModule,
    TabViewModule,
    FontAwesomeModule,
    ToastModule,
    InputTextModule,
    HttpClientModule,
    NgApexchartsModule,
    MeterwiseModule,
    HistoricalModule,
    SchGroupwiseModule,
    ComGroupwiseModule,
    SchMeterwiseModule,
    MeterheatmapModule,
    ComMeterwiseModule,
    LoaderModule
  ],
  providers:[MessageService, ConfirmationService],
  exports:[ReportsComponent]
})
export class ReportsModule { }
