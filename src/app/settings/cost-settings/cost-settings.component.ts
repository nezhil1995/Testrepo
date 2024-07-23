import { Component, OnInit } from '@angular/core';
import { faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation, faGear, faBatteryFull, faMoneyBillTrendUp, faPlug, faSolarPanel, faTrailer, faWind,} from '@fortawesome/free-solid-svg-icons';
import { MessageService, ConfirmationService, } from 'primeng/api';
import { faGasPump, faFire, faFireFlameCurved, faFireBurner, faWater, faPlugCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Currency } from 'src/app/CurrencyData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cost-settings',
  templateUrl: './cost-settings.component.html',
  styleUrls: ['./cost-settings.component.css']
})
export class CostSettingsComponent implements OnInit {

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

  CurrencyType = ''

  constructor(private Cookie: CookieService, private route: ActivatedRoute){

  }

  GetCurrencyData(value:string):any{
    const findsymbol = Currency.find((item)=> item.code === value)
    return findsymbol
  }

  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      this.CurrencyType = this.GetCurrencyData(params['Currency']);
    });
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
