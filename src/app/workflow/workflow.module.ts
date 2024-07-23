import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';

import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MaskloaderModule } from '../maskloader/maskloader.module';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DropdownModule,
    HttpClientModule,
    TableModule,
    TabViewModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    CheckboxModule,
    TagModule,
    TooltipModule,
    MaskloaderModule,
    LoaderModule
  ],
  exports:[WorkflowComponent],
  providers:[MessageService, ConfirmationService]
})
export class WorkflowModule { }
