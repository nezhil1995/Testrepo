import { Component, OnInit } from '@angular/core';
import { faBolt, fa1, fa2, fa3, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Meterview } from './Data'
import { MeterviewService } from './meterview.service';
import { interval } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meterview',
  templateUrl: './meterview.component.html',
  styleUrls: ['./meterview.component.css']
})
export class MeterviewComponent implements OnInit {

  kwh = faBolt
  shift1 = fa1
  shift2 = fa2
  shift3 = fa3
  fre = faChartLine

  load = true

  MeterViewData: Meterview[] = []
  GroupNamData: any = []

  stickyGroupIndex: number = -1;

  ngOnInit() : void{
    window.scroll(0,0)
    this.GetData();
  }

  

  ngAfterViewInit(): void {
    interval(60000).subscribe(() => {
      if(this.router.url === '/meter-view')
      this.GetData();
      // console.log('sending...')
    });
  }

  ShowDgGifOn(mtgrpname:string, metername:string, amper:string){
    if(mtgrpname === 'Incomer' && (metername === 'DGMeter1' || metername === 'DGMeter2' || metername === 'DGMeter3')){
      if(Number(amper) > 0){
        return true
      }
      else{
        return false
      }
    }
    else{
      return false
    }
  }

  ShowDgGifoff(mtgrpname:string, metername:string, amper:string){
    if(mtgrpname === 'Incomer' && (metername === 'DGMeter1' || metername === 'DGMeter2' || metername === 'DGMeter3')){
      if(Number(amper) > 0){
        return false
      }
      else{
        return true
      }
    }
    else{
      return false
    }
  }



  endpoint = 'meterdashboard'

  groupname = 'overviewdashboard'

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      response => {
        this.MeterViewData = response.data
        this.GroupNamData = response.groups
        this.load = false
        // console.log(this.MeterViewData)
        // console.log(this.GroupNamData)
      })
  }

  constructor(private ApiData: MeterviewService, private cdr: ChangeDetectorRef, private router: Router ) { }

  onScroll(){
    console.log('working index scroll',this.stickyGroupIndex)
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const badgeElements = document.querySelectorAll('.sticky-badge');
    for (let i = 0; i < badgeElements.length; i++) {
      const badgeElement = badgeElements[i] as HTMLElement;
      const rect = badgeElement.getBoundingClientRect();
    }
    this.cdr.detectChanges();
  }

}
