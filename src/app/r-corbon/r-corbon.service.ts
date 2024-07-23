import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';

import { URL_CONFIG } from '../url';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from '../urls';


@Injectable({
  providedIn: 'root'
})
export class RCorbonService {

  constructor(private http: HttpClient, private Cookie: CookieService, private Url: UrlService) {  }

  url = this.Url.UrlsSelectedPlant().mainUrl

  getData(endpoint:string):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(`${this.url}${endpoint}/`, {params,headers})
  }

  PostData(endpoint:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
  }

}
