import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    window.scroll(0,0)
    this.router.navigate(['dashboard/energy-consumption'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' })
  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }

  constructor(private router: Router, private Cookie: CookieService) {}

}
