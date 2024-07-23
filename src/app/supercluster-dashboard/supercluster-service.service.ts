import { Injectable } from '@angular/core';
import { URL_CONFIG } from '../url';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SuperclusterServiceService {

  url = URL_CONFIG.mainUrl
  Url = URL_CONFIG.mainUrl

  constructor(private http: HttpClient, private Cookie: CookieService,) {
    
  }

  getData(endpoint:string):Observable <any>{
    let params = new HttpParams().set('clusterid', this.Cookie.get('ClusterId'))
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/', {params, headers})
  }

  postData(endpoint:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname')).set('email', this.Cookie.get('emailid'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get(this.url+endpoint+'/')
    return this.http.post(this.Url+endpoint+'/', Data, {params, headers})
  }

  GetPlantCostDetails(endpoint:string, plant:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', plant);
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.Url+endpoint+'/', Data, {params, headers})
  }

  SECPostData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', 'MATE U-I');
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.Url+endpoint+'/', Data, {params, headers})
  }

  GetClusterPlants(endpoint: string){
    let params = new HttpParams().set('username', this.Cookie.get('username'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.Url+endpoint+'/',{params, headers})
  }

  
}
