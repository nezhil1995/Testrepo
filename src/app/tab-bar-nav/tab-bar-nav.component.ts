import { Component, Input, OnInit } from '@angular/core';
import { faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation, faGear, faBatteryFull, faMoneyBillTrendUp, faPlug, faSolarPanel, faTrailer, faWind,} from '@fortawesome/free-solid-svg-icons';
import { faGasPump, faFire, faFireFlameCurved, faFireBurner, faWater, faPlugCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab-bar-nav',
  templateUrl: './tab-bar-nav.component.html',
  styleUrls: ['./tab-bar-nav.component.css']
})
export class TabBarNavComponent implements OnInit {

  @Input() bardata:any

  @Input() LoginType!:boolean

  queryParams:any

  cookieCheck(): boolean{
    return this.Cookie.check('username') &&  this.Cookie.check('emailid') && this.Cookie.check('plantname')
  }

  UsertypesAllowed(): boolean {
    return this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'CORPORATE-ADMIN' || this.Cookie.get('type') === 'CLUSTER-ADMIN' || this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN'
  }

  IsAdmin(): boolean {
    if(this.cookieCheck() && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg' && this.UsertypesAllowed()){
      return true
    }
    else{
      return false
    }
  }

  constructor(private Cookie: CookieService){
    
  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }

  GetquaryParams(value:string){
    if(value == 'COST SETTINGS'){
      return { isAdmin: this.IsAdmin(), Currency: this.AdminCurrency() }
    }
    else{
      return { isAdmin: this.IsAdmin() }
    }
  }


  ngOnInit(): void {
      
  }

}
