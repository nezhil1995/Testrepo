import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CryptoService } from '../login/cypher.service'; 
import { URL_CONFIG } from '../url';
import { from, switchMap } from 'rxjs';
import { UrlService } from '../urls';


@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  constructor(private http: HttpClient, private Cookie: CookieService, private Decryption: CryptoService, private Url: UrlService ) {  }

  url = this.Url.UrlsSelectedPlant().mainUrl

  async DecryptData(Data:string): Promise<string>{
    const encryptedToken = this.Cookie.get('Sec_User_toc');
    const key = await this.Decryption.generateKey();
    const decryptedToken = await this.Decryption.decrypt(encryptedToken, key);
    // console.log(decryptedToken)
    return decryptedToken
  }

  GetSECMonthdata(endpoint:string, month:string, year:string):Observable <any>{
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('month', month),
    params = params.append('year', year)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }


  getData(endpoint:string):Observable <any> {
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }

  SaveData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
  }

  UpdateData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    return this.http.put(this.url + endpoint + '/', Data,{params,headers})
  }

  DeleteData(endpoint:string, code:any){
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
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

  /*----------------------------COSTDATA----------------------------*/

  GetCostDataMonth(endpoint:string, source:string, month:string, year:string):Observable <any>{
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('source', source), 
    params = params.append('month', month),
    params = params.append('year', year)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'))
    return this.http.get(this.url + endpoint + '/',{params,headers})
  }

  GetCostData(endpoint:string, source:string):Observable <any> {
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('source', source)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'))
    return this.http.get(this.url + endpoint + '/',{params,headers})
  }

  SaveCostData(endpoint:string, source:string, Data:any){
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('source', source)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'))
    const options = {
      params,
      responseType: 'text' as const,
      headers
    };
    return this.http.post(this.url + endpoint + '/', Data, options)
  }

  UpdateCostData(endpoint:string, source:string, Data:any){
    let params = new HttpParams()
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('source', source)
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'))
    const options = {
      params,
      responseType: 'text' as const,
      headers
    };
    return this.http.put(this.url + endpoint + '/', Data, options)
  }

  DeleteCostData(endpoint:string, source:string, Data:any){
    let params = new HttpParams();
    params = params.append('plantname', this.Cookie.get('plantname'))
    params = params.append('source', source);
    const body = JSON.stringify({code: Data});
    let headers = new HttpHeaders().set('Authorization', 'Token ' +this.Cookie.get('Sec_User_toc'));
    const options = ({
      headers : headers,
      body : body,
      params,
      responseType: 'text' as const
    });
    return this.http.delete(this.url+endpoint+'/', options)
  }

  // Normal testing-------------------------------------------------

  get(url:string, endpoint:string):Observable <any>{
    return this.http.get(`http://${url}/${endpoint}`)
  }

  Save(url:string, endpoint:any, post:any){
    return this.http.post(`http://${url}/${endpoint}`,post)
  }

  Update(url:string, endpoint:string, Idname:string, Id:number, update:any){
    // console.log(update)
    return this.http.put(`http://${url}/${endpoint}/${Id}`,update)
  }

  Delete(url:string, endpoint:string, Id:number){
    return this.http.delete(`http://${url}/${endpoint}/${Id}`)
  }

}
