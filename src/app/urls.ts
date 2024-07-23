import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class UrlService {

  constructor(private Cookie: CookieService){}

  Urldata = [
    {
      plantname: "MATE-Becharaji",               
      mainUrl: "https://robisiot.in:6551/",
      webscoketUrl: 'ws://robisiot.in:6551/ws/'
    },
    {
      plantname: "MATE U-I",                    
      mainUrl: "http://127.0.0.1:8000/",
      webscoketUrl: 'http://127.0.0.1:8000/ws/'
    },
    // {
    //   plantname: "MATE U-I",                    
    //   mainUrl: "https://robisiot.in:6552/",
    //   webscoketUrl: 'ws://robisiot.in:6552/ws/'
    // },
    {
      plantname: "MATE ROBIS",               
      mainUrl: "https://robisiot.in:6584/",
      webscoketUrl: 'ws://robisiot.in:6584/ws/'
    },
    {
      plantname: "MATE U3E",
      mainUrl: "https://robisiot.in:6553/",
      webscoketUrl: 'ws://robisiot.in:6553/ws/'
    },
    {
      plantname: "MATE U3-D",
      mainUrl: "https://robisiot.in:6554/",
      webscoketUrl: 'ws://robisiot.in:6554/ws/'
    },
    {
      plantname: "MATE PUNE",
      mainUrl: "https://robisiot.in:6555/",
      webscoketUrl: 'ws://robisiot.in:6555/ws/'
    },
    {
      plantname: "MATE FSP",
      mainUrl: "https://robisiot.in:6557/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE Tapukara",
      mainUrl: "https://robisiot.in:6558/",
      webscoketUrl: 'ws://robisiot.in:6558/ws/'
    },
    {
      plantname: "MATE Ranjangaon",
      mainUrl: "https://robisiot.in:6559/",
      webscoketUrl: 'ws://robisiot.in:6559/ws/'
    },
    {
      plantname: "MATE U3W",
      mainUrl: "https://robisiot.in:6560/",
      webscoketUrl: 'ws://robisiot.in:6560/ws/'
    },
    {
      plantname: "MATE U3T",
      mainUrl: "https://robisiot.in:6561/",
      webscoketUrl: 'ws://robisiot.in:6561/ws/'
    },
    {
      plantname: "MATE Bangalore",
      mainUrl: "https://robisiot.in:6562/",
      webscoketUrl: 'ws://robisiot.in:6562/ws/'
    },
    {
      plantname: "SMRC Hinjewadi",
      mainUrl: "https://robisiot.in:6564/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "SMRC Chakan",
      mainUrl: "https://robisiot.in:6565/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "SMRC Chennai",
      mainUrl: "https://robisiot.in:6583/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "SMRC AP",
      mainUrl: "https://robisiot.in:6567/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "SMIEL CD",
      mainUrl: "https://robisiot.in:6568/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "SMIEL TD",
      mainUrl: "https://robisiot.in:6569/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MMDL Manesar",
      mainUrl: "https://robisiot.in:6574/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE PONDY-TD",
      mainUrl: "https://robisiot.in:6575/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE Sanand",
      mainUrl: "https://robisiot.in:6576/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE Nashik",
      mainUrl: "https://robisiot.in:6577/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE Manesar",
      mainUrl: "https://robisiot.in:6578/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MATE PONDY-CD",
      mainUrl: "https://robisiot.in:6579/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "MALT Noida",
      mainUrl: "https://robisiot.in:6585/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "CTMIL Sanand",
      mainUrl: "https://robisiot.in:6581/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
    {
      plantname: "CTMIL Chennai",
      mainUrl: "https://robisiot.in:6582/",
      webscoketUrl: 'ws://robisiot.in:6577/ws/'
    },
  ]


  UrlsSelectedPlant(): any {
    let Plantname = this.Cookie.get('plantname')
    if(this.Cookie.check('plantname')){
      let UrlData, count = 0
      for(let i=0; i<this.Urldata.length; i++){
        if(this.Urldata[i].plantname == Plantname){
          count = 1
          UrlData = this.Urldata[i]
          break
        }
      }
      if(count == 1){
        return UrlData
      }
      else{
        return {mainUrl:'no_url_found'}
      }
      
    }
    else{
      return {mainUrl:'no_url_found'}
    }
    
  }

}