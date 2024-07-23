import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_CONFIG } from '../url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ClusterserviceService {

  url = URL_CONFIG.mainUrl

  constructor(private http: HttpClient, private Cookie: CookieService,) {
    
  }

  getData(endpoint:string):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('Auth_plants'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get('http://localhost:3000/'+endpoint+'/',)
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }

  GetPlantDetails(endpoint:string, plant:string):Observable <any>{
    let params = new HttpParams().set('plantname', plant);
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/',{params, headers})
  }

  SECPostData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', 'MATE U-I');
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url+endpoint+'/', Data, {params, headers})
  }

  Postdata(endpoint:string, Data:any):Observable <any>{
    let params = new HttpParams().set('plantname', this.Cookie.get('Auth_plants'));
    const headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    // return this.http.get('http://localhost:3000/'+endpoint+'/',)
    return this.http.post(this.url+endpoint+'/', Data, {params, headers})
  }

}
