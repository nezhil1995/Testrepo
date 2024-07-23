import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;

  constructor(private Cookie: CookieService) { }

  setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  isAuthenticated(): boolean {

    if (this.Cookie.check('username') &&  this.Cookie.check('emailid') && this.Cookie.check('plantname')){
      this.isLoggedIn = true;
      return this.isLoggedIn;
    }

    return this.isLoggedIn;

  }
}
