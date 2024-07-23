import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ClusterDashboardModule } from './cluster-dashboard/cluster-dashboard.module';
import { CorporateDashboardModule } from './corporate-dashboard/corporate-dashboard.module';
import { SuperclusterDashboardModule } from './supercluster-dashboard/supercluster-dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { RCorbonModule } from './r-corbon/r-corbon.module';
import { LoginModule } from './login/login.module';
import { MeterviewModule } from './meterview/meterview.module';
import { ReportsModule } from './reports/reports.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { TmNgOdometerModule } from 'tm-ng-odometer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { FooterModule } from './footer/footer.module';
import { ScrollTopModule } from 'primeng/scrolltop';
import { MaskloaderModule } from './maskloader/maskloader.module';
import { LoaderModule } from './loader/loader.module'
import { JoyrideModule } from 'ngx-joyride';
import { NavDashboardModule } from './nav-dashboard/nav-dashboard.module';
import { PreLoaderModule } from './pre-loader/pre-loader.module';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ChipsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule,
    TagModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    BadgeModule,
    HomeModule,
    CorporateDashboardModule,
    ClusterDashboardModule,
    SuperclusterDashboardModule,
    DashboardModule,
    SettingsModule,
    RCorbonModule,
    LoginModule,
    MeterviewModule,
    ReportsModule,
    WorkflowModule,
    AnalyticsModule,
    FooterModule,
    TmNgOdometerModule,
    ScrollTopModule,
    MaskloaderModule,
    LoaderModule,
    NavDashboardModule,
    PreLoaderModule,
    SidebarModule,
    JoyrideModule.forRoot(),
    TabViewModule 
  ],
  exports: [SidebarComponent, NavbarComponent],
  providers:[MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
