import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.css']
})
export class NavDashboardComponent {

  constructor(private Cookie: CookieService){

  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }

}
