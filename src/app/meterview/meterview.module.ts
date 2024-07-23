import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterviewComponent } from './meterview.component';

import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BadgeModule } from 'primeng/badge';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    MeterviewComponent
  ],
  imports: [
    CommonModule,
    DividerModule,
    TagModule,
    FontAwesomeModule,
    BadgeModule,
    LoaderModule
  ],
  exports: [MeterviewComponent]
})
export class MeterviewModule { }
