import { Component, OnInit } from '@angular/core';
import { SuperclusterServiceService } from './supercluster-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-supercluster-dashboard',
  templateUrl: './supercluster-dashboard-new.html',
  styleUrls: ['./supercluster-dashboard-new.css'],
  providers: [DatePipe]
})
export class SuperclusterDashboardComponent implements OnInit {

  supcluData: any[]= []
  load = true

  endpointEnergy = 'supercluster-dashboard'
  displayModal = false
  plantName = ''
  plantLoc = ''
  form:FormGroup
  carForm:FormGroup
  maxDate = new Date();
  date = new Date();

  plantCostData: any[] = []

  stateOptionsEms: any[] = [
    {
      label: 'DASHBOARD', value: 'card', icon: 'fi fi-ss-credit-card'
    }, 
    {
      label: 'ANALYTICS', value: 'chart', icon: 'fi fi-br-stats'
    }
  ];

  value: string = 'card';

  ngOnInit(): void {
    this.GetData()
  }


  constructor(private ApiData: SuperclusterServiceService, private datePipe: DatePipe) {
    this.form = new FormGroup({
      selectYear: new FormControl('',Validators.required),
    })

    this.carForm = new FormGroup({
      value: new FormControl('')
    })

  }

  GetData(){
    this.ApiData.getData(this.endpointEnergy).subscribe(
      res => {
        this.supcluData = res
        this.load = false
      }
    )
  }

  closeModal(){
    this.displayModal = false
    this.form.reset()
  }

  getMoreInfo(plant:any){
    this.displayModal = true
    this.plantName = plant.name
    this.plantLoc = plant.location
    let DefaultData = new Date
    this.date = DefaultData;
    this.GetYearTableData(DefaultData)
  }

  plantDitEndpoint = 'supercluster-plantmonthdetails'
  tableHeight = '435px'

  tableDataload = false

  DiaMaximized(value:any){
    if(value.maximized){
      this.tableHeight = '520px'
    }
    else{
      this.tableHeight = '435px'
    }
  }

  selectedYear = ''

  GetYearTableData(date:any){
    this.tableDataload = true
    const year = this.datePipe.transform(date, 'yyyy');
    this.selectedYear = (year)!.toString()
    let FormData = {
      Year: year
    }
    this.ApiData.GetPlantCostDetails(this.plantDitEndpoint, this.plantName, FormData).subscribe(
      res => {
        this.plantCostData = res
        this.tableDataload = false
      }
    )
  }

}
