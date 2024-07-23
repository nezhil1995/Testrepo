import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { URL_CONFIG } from '../url';
import { UrlService } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class LoginserviseService {

  constructor(private http: HttpClient, private Url: UrlService) { }

  url = this.Url.UrlsSelectedPlant().mainUrl
  

  getData(UserData:any):Observable <any>{
    this.url = this.Url.UrlsSelectedPlant().mainUrl
    const Headers = {'content-type': 'application/json'}
    const body = JSON.stringify(UserData)
    return this.http.post(this.url+'loginvalidation'+'/',body,{'headers':Headers})
  }


}
