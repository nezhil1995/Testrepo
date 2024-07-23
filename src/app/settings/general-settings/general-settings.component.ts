import { Component } from '@angular/core';
import { faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation, faGear, faBatteryFull, faMoneyBillTrendUp, faPlug, faSolarPanel, faTrailer, faWind,} from '@fortawesome/free-solid-svg-icons';
import { MessageService, ConfirmationService, } from 'primeng/api';
import { faGasPump, faFire, faFireFlameCurved, faFireBurner, faWater, faPlugCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent {

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

  constructor(private Cookie: CookieService){

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
