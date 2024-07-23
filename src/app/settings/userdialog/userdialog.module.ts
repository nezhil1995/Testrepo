import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserdialogComponent } from './userdialog.component';

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
import { TooltipModule } from 'primeng/tooltip';
import { MaskloaderModule } from 'src/app/maskloader/maskloader.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoaderModule } from 'src/app/loader/loader.module';

@NgModule({
  declarations: [
    UserdialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DropdownModule,
    HttpClientModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    TooltipModule,
    MaskloaderModule,
    MultiSelectModule,
    LoaderModule
  ],
  exports: [ UserdialogComponent ],

})
export class UserdialogModule { }
