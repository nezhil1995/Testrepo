import { Component, OnInit } from '@angular/core';

import { faGaugeHigh, faClockRotateLeft, faClipboardCheck, faCodeCompare, faClipboardList, faMeteor, faStickyNote, faNoteSticky } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  meter = faGaugeHigh
  his = faClockRotateLeft
  sch = faClipboardCheck
  com = faCodeCompare
  comM = faClipboardList
  Het = faMeteor
  not = faNoteSticky

  ngOnInit() : void{
    window.scroll(0,0)
  }

}
