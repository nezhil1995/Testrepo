import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RCorbonModule } from '../r-corbon/r-corbon.module';
import { TmNgOdometerModule } from 'tm-ng-odometer';
import { NavDashboardModule } from '../nav-dashboard/nav-dashboard.module';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    DashboardModule,
    RCorbonModule,
    TmNgOdometerModule,
    NavDashboardModule,
    RouterOutlet
  ],
  exports:[HomeComponent]
})
export class HomeModule { }
