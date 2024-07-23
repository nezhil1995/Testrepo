import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  exports: [AnalyticsComponent]
})
export class AnalyticsModule { }
