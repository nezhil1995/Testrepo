import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterwiseComponent } from './meterwise.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/loader/loader.module';

@NgModule({
  declarations: [
    MeterwiseComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule
  ],
  exports:[MeterwiseComponent]
})
export class MeterwiseModule { }
