import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcesspowerComponent } from './excesspower.component';

import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { LoaderModule } from 'src/app/loader/loader.module';


@NgModule({
  declarations: [
    ExcesspowerComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TooltipModule,
    DialogModule,
    LoaderModule
  ],
  exports:[ExcesspowerComponent]
})
export class ExcesspowerModule { }
