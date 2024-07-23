import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { URL_CONFIG } from '../url';
import { CookieService } from 'ngx-cookie-service';
import { UrlService } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  url = this.Url.UrlsSelectedPlant().mainUrl

  constructor(private http: HttpClient, private Cookie: CookieService, private Url: UrlService) { }

  postData(endpoint:string, Data:any): Observable<any>{
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, { params, headers });
  }

  getData(endpoint:string) : Observable<any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url + endpoint + '/', { params, headers });
  }

  getTest(endpoint:string): Observable<any> {
    return this.http.get('http://localhost:3000/' + endpoint);
  }

}
