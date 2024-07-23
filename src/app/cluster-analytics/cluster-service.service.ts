import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_CONFIG } from '../url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ClusterAlalyticsServiceService {

  url = URL_CONFIG.mainUrl

  constructor(private http: HttpClient, private Cookie: CookieService,) {
    
  }

  getClusterPlants(endpoint: string):Observable <any>{
    let params = new HttpParams().set('clustername', this.Cookie.get('username'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/',{params, headers})
  }

  Postdata(endpoint:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('Auth_plants'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get('http://localhost:3000/'+endpoint+'/',)
    return this.http.post(this.url+endpoint+'/', Data, {headers})
  }

  GetClusterSrc(endpoint: string, Data:any):Observable<any> {
    let params = new HttpParams().set('plant', Data);
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.put(this.url+endpoint+'/',Data,{headers})
  }

  getClusterPF(endpoint: string, date: any, plantsData:any):Observable<any>{
    let params = new HttpParams().set('Date', date);
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get('http://localhost:4000/'+endpoint+'/',)
    return this.http.post(this.url+endpoint+'/',plantsData,{params, headers})
  }
}
