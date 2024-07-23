import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation, faGear, faBatteryFull, faMoneyBillTrendUp, faPlug, faSolarPanel, faTrailer, faWind, faCalendarDay,} from '@fortawesome/free-solid-svg-icons';
import { MessageService, ConfirmationService, } from 'primeng/api';
import { faGasPump, faFire, faFireFlameCurved, faFireBurner, faWater, faPlugCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {

  user = faUserPen
  met = faComputer
  ger = faGears
  warh = faWarehouse
  ses = faBusinessTime
  gro = faLayerGroup
  warning = faTriangleExclamation
  set = faGear
  src = faBatteryFull
  cos = faMoneyBillTrendUp
  plug = faPlug
  deman = faPlugCircleCheck
  sol = faSolarPanel
  tra = faTrailer
  wind = faWind
  petrol = faGasPump
  lpg = faFire
  gas = faFireFlameCurved
  png = faFireBurner
  wat = faWater
  cal = faCalendarDay

  Data:any[] = []

  constructor(private Cookie: CookieService, private router: Router) {
    this.router.navigate(['settings/accounts'], { queryParams: { isAdmin: this.IsAdmin() }, queryParamsHandling: 'merge' });

  }

  ngOnInit(): void{
    window.scroll(0,0);
    this.Data = [
      {
        icon : this.user,
        name: 'ACCOUNTS',
        routerpath: '/settings/accounts',
      },
      {
        icon : this.met,
        name: 'DEVICE MANAGER',
        routerpath: '/settings/meter-management',
      },
      {
        icon : this.ger,
        name: 'GENERAL SETTINGS',
        routerpath: '/settings/general-settings',
      },
      {
        icon : this.set,
        name : 'SEC SETTINGS',
        routerpath: '/settings/sec-settings',
      },
      {
        icon : this.cos,
        name : 'COST SETTINGS',
        routerpath: '/settings/cost-settings',
      },
      // {
      //   icon : this.cal,
      //   name : 'HOLIDAY SETTINGS',
      //   routerpath: '/settings/holiday-settings',
      // }
    ]
  }

  cookieCheck(): boolean{
    return this.Cookie.check('username') &&  this.Cookie.check('emailid') && this.Cookie.check('plantname')
  }

  UsertypesAllowed(): boolean {
    return this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'CORPORATE-ADMIN' || this.Cookie.get('type') === 'CLUSTER-ADMIN' || this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN'
  }

  IsAdmin() {
    if(this.cookieCheck() && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg' && this.UsertypesAllowed()){
      return true
    }
    else{
      return false
    }
  }

}
