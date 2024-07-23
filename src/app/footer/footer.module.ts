import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

import { TmNgOdometerModule } from 'tm-ng-odometer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { MaskloaderModule } from '../maskloader/maskloader.module';


@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    TmNgOdometerModule,
    DialogModule,
    MaskloaderModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
