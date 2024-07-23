import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavDashboardComponent } from './nav-dashboard.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    NavDashboardComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports:[NavDashboardComponent]
})
export class NavDashboardModule { }
