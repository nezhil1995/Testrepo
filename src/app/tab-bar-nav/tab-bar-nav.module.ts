import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarNavComponent } from './tab-bar-nav.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    TabBarNavComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  exports:[TabBarNavComponent]
})
export class TabBarNavModule { }
