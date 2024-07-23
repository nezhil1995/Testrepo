import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateDashboardComponent } from './corporate-dashboard.component';
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


@NgModule({
  declarations: [
    CorporateDashboardComponent
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
    SelectButtonModule
  ],
  exports: [
    CorporateDashboardComponent
  ]
})
export class CorporateDashboardModule { }
