import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'

import { URL_CONFIG } from '../url';
import { UrlService } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private http: HttpClient, private Cookie: CookieService, private Url: UrlService) { }

  url = this.Url.UrlsSelectedPlant().mainUrl

  getData(endpoint:string):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint,{params, headers})
  }

  SaveData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
  }

  UpdateData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname',  this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.put(this.url + endpoint + '/', Data,{params,headers})
  }

  DeleteData(endpoint:string, code:any){
    let params = new HttpParams().set('plantname',  this.Cookie.get('plantname'));
    const body = JSON.stringify({code: code});
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    const options = ({
      headers : headers,
      body : body,
      params
    });
    // console.log(options);
    return this.http.delete(this.url + endpoint + '/',options)
  }

  getTest(endpoint:string):Observable <any>{
    return this.http.get(this.url+endpoint+'/')
  }

  Save(endpoint:any, post:any){
    return this.http.post(`${this.url}${endpoint}`,post)
  }

  Update(endpoint:string, id:number, update:any){
    return this.http.put(`${this.url}${endpoint}/${id}`,update)
  }

  Delete(endpoint:string, id:number){
    return this.http.delete(`${this.url}${endpoint}/${id}`)
  }

  get1(url:string, endpoint:string):Observable <any>{
    return this.http.get(`http://${url}/${endpoint}`)
  }




}
