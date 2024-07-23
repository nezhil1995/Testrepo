import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_CONFIG } from '../url';
import { CookieService } from 'ngx-cookie-service';
import { webSocket } from 'rxjs/webSocket';
import { UrlService } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  url = this.Url.UrlsSelectedPlant().mainUrl

  WEBsocketUrl = this.Url.UrlsSelectedPlant().webscoketUrl

  constructor(private http: HttpClient, private Cookie: CookieService, private Url: UrlService) {
  }

  getData(endpoint:string):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/',{params, headers})
  }

  HorGetData(endpoint:string, source:string, date:string){
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('sourcename', source)
    params = params.append('date', date)
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', null, { params, headers });
  }

  // PieCGetData(endpoint:string, date:string){
  //   let params = new HttpParams()
  //   params = params.append('plantname', this.Cookie.get('plantname'))
  //   params = params.append('date',date)
  //   return this.http.get(this.url+endpoint+'/',{params})
  // }

  EmailPostData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params, headers})
  }

  CostPostData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params, headers})
  }

  SECPostData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params, headers})
  }

  PflogGet(endpoint:string, date:any):Observable <any>{
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('date', date)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url + endpoint + '/', {params, headers})
  }

  WeatherGetData():Observable <any>{
    let apiID = 'f0095379d48947ed541c34830c33204e'
    let lat = (this.Cookie.get('lat')).toString()
    let lon = (this.Cookie.get('lon')).toString()
    
    // return this.http.get('http://localhost:3000/weather')
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiID}&units=metric`)
  }

  NotificationSocket(endpoint:string): Observable<any> {
    const wsUrl = `${this.WEBsocketUrl}${endpoint}/?plantname=${this.Cookie.get('plantname')}`;
    let websocket = webSocket(wsUrl);
    return websocket;
  }

  NotifyConnect(endpoint:string, Data:any): Observable<any> {
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params, headers})
  }

  UserLogout(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.put(this.url + endpoint + '/', Data, {params, headers})
  }

  Postdata(endpoint: string, Data: any): Observable<any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get('http://localhost:3000/'+endpoint+'/',)
    return this.http.post(this.url + endpoint + '/', Data, {params, headers})
  }

  PowerDetailData(endpoint: string, Date:any): Observable<any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname')).set('date', Date);
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url + endpoint+'/',{params, headers})
    // return this.http.get('http://localhost:3000/' + endpoint)
  }

  

}