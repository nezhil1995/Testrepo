import { Component, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service'
import { AuthGuard } from './auth/auth.guard'

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { MeterviewComponent } from './meterview/meterview.component';
import { ReportsComponent } from './reports/reports.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ClusterDashboardComponent } from './cluster-dashboard/cluster-dashboard.component';
import { CorporateDashboardComponent } from './corporate-dashboard/corporate-dashboard.component';
import { SuperclusterDashboardComponent } from './supercluster-dashboard/supercluster-dashboard.component'
import { ClusterAnalyticsComponent } from './cluster-analytics/cluster-analytics.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RCorbonComponent } from './r-corbon/r-corbon.component';

// setings -> 
import { UserdialogComponent } from './settings/userdialog/userdialog.component';
import { AddEditComponent } from './settings/metertab/add-edit.component';
import { GeneralSettingsComponent } from './settings/general-settings/general-settings.component';
import { SectableComponent } from './settings/sectable/sectable.component';
import { CostSettingsComponent } from './settings/cost-settings/cost-settings.component';
import { HolidaySettingsComponent } from './settings/holiday-settings/holiday-settings.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'clusterhead-dashboard', component: ClusterDashboardComponent, canActivate:[AuthGuard]},
  {path:'super-clusterhead-dashboard', component: SuperclusterDashboardComponent, canActivate:[AuthGuard]},
  {path:'dashboard', component: HomeComponent, children: [{path:'energy-consumption', component: DashboardComponent, canActivate:[AuthGuard]}, {path:'r-carbon', component: RCorbonComponent, canActivate:[AuthGuard]}], canActivate:[AuthGuard]},
  {path:'meter-view',component: MeterviewComponent, canActivate:[AuthGuard]},
  {path:'reports', component: ReportsComponent, canActivate:[AuthGuard]},
  {path:'workflow', component: WorkflowComponent, canActivate:[AuthGuard]},
  {path:'analytics', component: AnalyticsComponent, canActivate:[AuthGuard]},
  {path:'cluster-analytics', component: ClusterAnalyticsComponent, canActivate:[AuthGuard]},
  {path:'settings', component: SettingsComponent, children:[
    {
      path:'accounts',
      component: UserdialogComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'meter-management',
      component: AddEditComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'general-settings',
      component: GeneralSettingsComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'sec-settings',
      component: SectableComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'cost-settings',
      component: CostSettingsComponent,
      canActivate:[AuthGuard]
    },
    // {
    //   path: 'holiday-settings',
    //   component: HolidaySettingsComponent,
    //   canActivate:[AuthGuard]
    // }
  ], 
  canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    AuthGuard
  ],
})
export class AppRoutingModule { }
