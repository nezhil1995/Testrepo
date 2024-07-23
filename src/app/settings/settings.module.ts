import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AddEditModule } from './metertab/add-edit.module';
import { UserdialogModule } from './userdialog/userdialog.module';
import { PlantdialogModule } from './plantdialog/plantdialog.module';
import { SessiondiaModule } from './sessiondia/sessiondia.module';
import { GroupdiaModule } from './groupdia/groupdia.module';
import { SourcetabModule } from './sourcetab/sourcetab.module';
import { SectableModule } from './sectable/sectable.module';
import { EbcostModule } from './ebcost/ebcost.module';
import { DgcostModule } from './dgcost/dgcost.module';
import { SolarcostModule } from './solarcost/solarcost.module';
import { WindcostModule } from './windcost/windcost.module';
import { PetrolModule } from './petrol/petrol.module'
import { LpgcostModule } from './lpgcost/lpgcost.module';
import { CngcostModule } from './cngcost/cngcost.module';
import { PngcostModule } from './pngcost/pngcost.module';
import { WatercostModule } from './watercost/watercost.module';

import { AppRoutingModule } from '../app-routing.module';

import { SettingsComponent } from './settings.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KvacostModule } from './kvacost/kvacost.module';
import { TabBarNavModule } from '../tab-bar-nav/tab-bar-nav.module';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { CostSettingsComponent } from './cost-settings/cost-settings.component';
import { HolidaySettingsComponent } from './holiday-settings/holiday-settings.component';
import { MaskloaderModule } from '../maskloader/maskloader.module';
import { LoaderModule } from '../loader/loader.module';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent,
    CostSettingsComponent,
    HolidaySettingsComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    AddEditModule,
    UserdialogModule,
    PlantdialogModule,
    SessiondiaModule,
    GroupdiaModule,
    SourcetabModule,
    SectableModule,
    EbcostModule,
    DgcostModule,
    SolarcostModule,
    WindcostModule,
    PetrolModule,
    LpgcostModule,
    CngcostModule,
    PngcostModule,
    WatercostModule,
    KvacostModule,
    ToastModule,
    InputTextModule,
    FontAwesomeModule,
    ConfirmDialogModule,
    TabViewModule,
    TabBarNavModule,
    MaskloaderModule,
    LoaderModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule
  ],
  exports: [
    SettingsComponent,
    HolidaySettingsComponent
  ],
  providers:[MessageService, ConfirmationService]
})
export class SettingsModule { }
