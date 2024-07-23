import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
      fontWeight?: string;
    };
  };
};

interface Chart {
  name: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title:ApexTitleSubtitle;
};


@Component({
  selector: 'app-meterwise',
  templateUrl: './meterwise.component.html',
  styleUrls: ['./meterwise.component.css'],
  providers:[DatePipe]
})
export class MeterwiseComponent implements OnInit {

  load: boolean = true

  chartLoad: boolean = false

  form:FormGroup;

  visiblechart = false

  date:any

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  @ViewChild("chart") chart!: ChartComponent;
  public areachartTrans: Partial<ChartOptions> | any;

  constructor(private ReportApi: ReportsService, private Cookie: CookieService, private datepipe: DatePipe)
  {
    this.form = new FormGroup({
      type: new FormControl(''),
      starttime: new FormControl('',Validators.required),
      endtime: new FormControl(''),
      plantname: new FormControl(''),
      mtrname: new FormControl('',Validators.required),
      cmptype: new FormControl(''),
      cmpstrtdate1: new FormControl(''),
      cmpenddate1: new FormControl(''),
      cmpstrtdate2: new FormControl(''),
      cmpenddate2: new FormControl(''),
      cmpplantname: new FormControl(''),
      cmpmetername: new FormControl(''),
    });

    this.areachartTrans = {
      series: [
        {
          name: "kWh",
          data: []
        }
      ],

      chart: {
        type: "area",
        height: '100%',
        zoom: {enabled: false},
        fontFamily: 'SharpSans, sans-serif',
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Meterwise hourly report`,
            }
          }
        },
      },
      grid: {
        show: false
      },

      dataLabels: {
        enabled: false
      },

      xaxis: {
        categories: [],
        floating:false,
        labels: {
          style: {
            fontSize: "14px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };

  }

  title!:string

  ngOnInit(): void {
    this.getCurrentDate();
    this.GetData();
  }


  meterNameEndpoint = 'metername'
  selectedEndpoint = 'Selected'
  endpoint = 'reporttable'

  metername : any

  meterNameDrop: any[] =[]

  selectedData : any

  GetData(){
    this.ReportApi.getData(this.meterNameEndpoint).subscribe(
      res=>{
        this.metername = res
        this.meterNameDrop = this.metername.meters
        // console.log(this.meterNameDrop)
        this.load = false
    })
  }

  FormUpdate(){
    this.title = this.form.get('mtrname')?.value;
    this.form.controls['type'].setValue('Meter view')
    this.form.controls['endtime'].setValue(this.form.get('starttime')?.value)
    this.form.controls['plantname'].setValue(this.Cookie.get('plantname'))
  }

  onSubmit(){
    this.chartLoad = true
    if (this.form.valid) {
      this.FormUpdate()
      this.UpdateLinechart();
      // console.log(this.form.value)
    } else {
      this.title = ''
    }
  }

  UpdateLinechart() {
    if (!this.form.valid) {
      this.chartLoad = false;
    }
    this.ReportApi.postData(this.endpoint, this.form.value).subscribe(
      res => {
        // console.log(res)
        this.selectedData = res;
        this.chartLoad = false;
        let areachart = [{
          name: 'kWh',
          data: this.selectedData.selectedmtrdata.mtrdata.map((value:any) => Number(value.toFixed(0)))
        }];
        let date = this.datepipe.transform(this.form.get('starttime')?.value, 'dd-MM-yyy')
        this.areachartTrans.xaxis.categories = this.selectedData.selectedmtrdata.lblmtr;
        this.areachartTrans.series = areachart;
        this.areachartTrans.title = { text: `Hourly Report for ${this.form.get('mtrname')?.value} (${date})`, align: 'center', style:{ fontSize:'15px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
      }
    );
  }

}
