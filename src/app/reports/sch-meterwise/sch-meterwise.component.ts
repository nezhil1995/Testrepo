import { Component, OnInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import { DatePipe } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip
};


@Component({
  selector: 'app-sch-meterwise',
  templateUrl: './sch-meterwise.component.html',
  styleUrls: ['./sch-meterwise.component.css'],
  providers:[DatePipe]
})

export class SchMeterwiseComponent implements OnInit, OnChanges, AfterViewInit {

  load: boolean = true

  chartLoad: boolean = false

  form:FormGroup;

  visiblechart = false

  date:any

  dropdownSta = [
    "Today",
    "Yesterday",
    "This week",
    "last 7 days",
    "This month",
    "last 30days",
    "Custom"
  ]

  groupname:any

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private ReportApi: ReportsService, private cdr: ChangeDetectorRef, private Cookie: CookieService, private datePipe:DatePipe)
  {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      starttime: new FormControl(''),
      endtime: new FormControl(''),
      plantname: new FormControl(''),
      mtrname: new FormControl(''),
      cmptype: new FormControl(''),
      cmpstrtdate1: new FormControl(''),
      cmpenddate1: new FormControl(''),
      cmpstrtdate2: new FormControl(''),
      cmpenddate2: new FormControl(''),
      cmpplantname: new FormControl(''),
      cmpmetername: new FormControl(''),
      daterange:new FormControl('')
    });

    this.chartOptions = {
      series: [],
      chart: {
        height: "100%",
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
      },
      plotOptions: {
        bar: {
          columnWidth: "65%",
          distributed: false,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"]
        },
        offsetY:-17
      },
      legend: {
        show: true,
        position:'top',
        fontSize: '14px',
        fontFamily: 'SharpSans, sans-serif',
        horizontalAlign: 'left',
      },
      stroke: {
        width: 2
      },
      grid: {
        show:true,
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      xaxis: {
        categories: [],
        // tickPlacement: 'on',
        floating: false,
        labels: {
          show: true,
          style: {
            fontSize: "14px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          },
        },
      },

      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + ' kWh'
          }
        }
      }

    };


  }

  ngOnInit(): void {
    this.getData()
  }

  ngAfterViewInit(): void {
  }

  Event = ''

  onTypeChange(event:string){
    if(event){
      this.Event = event
    }
  }

  onSubmit(){
    if (this.form.valid) {
      this.chartLoad = true;
      this.selectedFormType(this.form.get('type')?.value)
      // this.chartOptions.xaxis.categories = this.catagories
      if(this.form.controls['type']?.value != 'Custom'){
        this.UpdateLinechart(this.form.value, this.Event)
      }
      else{
        this.onDateRangeSelect()
        this.UpdateLinechart(this.Payload, this.Event)
      }
      this.title = this.Event;
    }
    else{
      this.title = ''
    }
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  chartWidthLen: number = 0


  title = ''
  selectedEndpoint = 'overviewdashboard'
  endpoint = 'reportgraph'

  chartData:any
  ChartEndpoint = 'Sch-meterwise'

  getData(){
    this.ReportApi.getData(this.selectedEndpoint).subscribe(
      res=>{
        this.chartData = res
        this.groupname = this.chartData.groupname
        this.load = false
    })
  }

  dataName : any[] = []
  energycoinsData : any[] = []
  catagories: any[] = []
  rangeDates!: Date[];
  @ViewChild('calendar') private calendar: any;
  maxDate = new Date();
  Payload:any

  onDateRangeSelect(){
    const selectedDates = this.form.controls['daterange']?.value;
    if (selectedDates[0] && selectedDates[1]){
      this.Payload={
        type: "Custom",
        starttime: this.datePipe.transform(selectedDates[0], 'yyyy-MM-dd'),
        endtime: this.datePipe.transform(selectedDates[1], 'yyyy-MM-dd'),
        plantname: this.Cookie.get('plantname'),
        mtrname: this.form.controls['mtrname']?.value,
        cmptype: "",
        cmpstrtdate1: "",
        cmpenddate1: "",
        cmpstrtdate2: "",
        cmpenddate2: "",
        cmpplantname: "",
        cmpmetername: "",
      }
      if(this.rangeDates[1] !== null){
        this.calendar.overlayVisible=false;
      }
    }
  }

  UpdateLinechart(form:any, selectedMeterName:string) {
    this.ReportApi.postData(this.endpoint,form).subscribe(
      res=>{
        this.chartData = res
        this.chartData.scheduledchart

        const lengthofscheduledchart = this.chartData.scheduledchart.length
        this.catagories = []
        let dataArray = []
        for(let i=0; i < this.chartData.mtrname.length; i++)
        {
          let meterName = this.chartData.mtrname[i].name;
          if(this.chartData.mtrname[i].group === selectedMeterName)
          {
            for(let j=0; j < lengthofscheduledchart; j++)
            {
              var chartItem = this.chartData.scheduledchart[j]
              const keys = Object.keys(chartItem);
              if(keys.includes(meterName))
              {
                var meterdata = chartItem[meterName]
                var dataLenght = chartItem[meterName].length
                let arr = []
                for (let i of meterdata)
                {
                  arr.push(i.energycons.toFixed(0))
                }
                let dataObject = {
                  name: meterName,
                  data: arr
                }
                dataArray.push(dataObject)
                if(!(dataLenght===1))
                {
                  for (let k = 0; k < dataLenght; k++) {
                    const currentDate = chartItem[meterName][k].date;
                    if (!this.catagories.includes(currentDate)) {
                      this.catagories.push(currentDate);
                    }
                  }
                }
                else
                {
                  const currentDate = chartItem[meterName][0].date;
                  if (!this.catagories.includes(currentDate))
                  {
                    this.catagories.push(currentDate);
                  }
                }
              }
            }
          }
        }
        // console.log(lengthofscheduledchart,dataLenght)
        // console.time(lengthofscheduledchart)
        // console.log(this.catagories.length)
        var length = dataLenght
        if(length===1){
          this.chartWidthLen = 100
        }
        else{
          this.chartWidthLen = length * 35
        }
        var width = `${this.chartWidthLen}%`
        this.chartOptions.series = dataArray
        this.chartOptions.xaxis.categories =  this.catagories
        this.chartOptions = {
          ...this.chartOptions,
          chart: {
            ...this.chartOptions.chart,
            width: width,
          }
        }

        this.visiblechart = true;
        this.chartLoad = false
      });
    }

  selectedFormType(value:any) {
    switch (value) {
      case 'Today':
        const currentDate = new Date().toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(currentDate);
        this.form.controls['endtime'].setValue(currentDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'Yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(yesterdayDate);
        this.form.controls['endtime'].setValue(yesterdayDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'This week':
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
        const endOfWeek = new Date();
        const startOfWeekDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeekDate = endOfWeek.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(startOfWeekDate);
        this.form.controls['endtime'].setValue(endOfWeekDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'last 7 days':
        const yesterday1 = new Date();
        yesterday1.setDate(yesterday1.getDate() - 1);
        const sevenDaysAgo = new Date(yesterday1);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0, 10);
        const yesterdayDate1 = yesterday1.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(sevenDaysAgoDate);
        this.form.controls['endtime'].setValue(yesterdayDate1);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'This month':
        const currentDate1 = new Date();
        currentDate1.setDate(1);
        const startOfMonthDate = currentDate1.toISOString().slice(0, 10);
        const endOfMonthDate = new Date().toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(startOfMonthDate);
        this.form.controls['endtime'].setValue(endOfMonthDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'last 30days':
        const currentDate2 = new Date();
        currentDate2.setDate(currentDate2.getDate() - 1);
        const thirtyDaysAgo = new Date(currentDate2);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().slice(0, 10);
        const currentDateISO = currentDate2.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(thirtyDaysAgoDate);
        this.form.controls['endtime'].setValue(currentDateISO);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

    }
  }

}


