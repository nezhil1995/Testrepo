import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KvacostComponent } from './kvacost.component';

import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MaskloaderModule } from 'src/app/maskloader/maskloader.module';
import { LoaderModule } from 'src/app/loader/loader.module';

@NgModule({
  declarations: [
    KvacostComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DropdownModule,
    InputTextModule,
    HttpClientModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    MaskloaderModule,
    LoaderModule
  ],
  exports:[KvacostComponent]
})
export class KvacostModule { }
