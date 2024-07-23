import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { ClusterserviceService } from './clusterservice.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
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
  ApexTheme,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { JoyrideService }from 'ngx-joyride';
import { faArrowUpRightFromSquare, faBolt, faSeedling } from '@fortawesome/free-solid-svg-icons';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

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
  theme: ApexTheme;
  fill: ApexFill,
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-cluster-dashboard',
  templateUrl: './cluster-dashboard.component.html',
  styleUrls: ['./cluster-dashboard.component.css'],
  providers:[DatePipe]
})
export class ClusterDashboardComponent implements OnInit {

  eng = faBolt
  car = faSeedling
  arrow = faArrowUpRightFromSquare

  endpoint = 'clusterhead'
  load:boolean = true
  customContent!: TemplateRef<any>;
  switchContent!: EventEmitter<any>;
  firsttimeLogin = this.Cookie.get('firstlog')
  Username = this.Cookie.get('username')

  stateOptionsEms: any[] = [
    {
      label: 'CARD VIEW', value: 'card', icon: 'fi fi-ss-credit-card'
    }, 
    {
      label: 'CHART VIEW', value: 'chart', icon: 'fi fi-br-stats'
    }
  ];

  value: string = 'card';


  cluData: any[] = []
  clucarData:any[] = []
  plants: any[] = []

  form: FormGroup
  carForm : FormGroup
  secform : FormGroup
  kvaform : FormGroup
  peakOffpeakform : FormGroup

  ngOnInit(): void {
    this.GetDataEnergy()
  }

  startTour(){
    this.Joyride.startTour({ 
        steps: ['first','step0'],
        showPrevButton: true,
        stepDefaultPosition: 'right',
     }
    )
  }


  @ViewChild("chart") chart!: ChartComponent;
  public EnrchartOptions: Partial<ChartOptions> | any;
  public EnrCostchartOptions: Partial<ChartOptions> | any;
  public CarbonChart: Partial<ChartOptions> | any;
  public peakOffpeakchartOptions: Partial<ChartOptions> | any;
  public secChartOptions:any
  public KvaChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;

  constructor(private ApiData:ClusterserviceService, private Cookie: CookieService, private router: Router, private Joyride: JoyrideService, private confirmation: ConfirmationService, private datePipe: DatePipe) {

    this.form = new FormGroup({
      value: new FormControl('')
    })

    this.carForm = new FormGroup({
      value: new FormControl('')
    })

    this.secform = new FormGroup({
      year: new FormControl('', Validators.required)
    })

    this.kvaform = new FormGroup({
      date: new FormControl('', Validators.required),
      plant: new FormControl('', Validators.required)
    })

    this.peakOffpeakform = new FormGroup({
      type: new FormControl('', Validators.required),
      month: new FormControl(''),
      date: new FormControl('')
    })

    this.EnrchartOptions = {
      series: [
        {
          name: 'kWh',
          data: []
        },
      ],

      chart: {
        height: '99%',
        width: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
      },

      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: false,
          rangeBarOverlap: false,
          dataLabels: {
            position: 'top',
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -17,
        formatter:(val:any)=> {
          return this.formatNumber(val)
        },
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"],
          fontSize: '10px',
        },
        background: {
          padding: 10
        }
      },
      legend: {
        show: true,
        position:'top',
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
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

    this.EnrCostchartOptions = {
      series: [
        {
          name: 'kWh',
          data: []
        },
      ],

      chart: {
        height: '99%',
        width: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
      },

      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: false,
          rangeBarOverlap: false,
          dataLabels: {
            position: 'top',
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -17,
        formatter:(val:any)=> {
          return this.formatNumber(val)
        },
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"],
          fontSize: '10px',
        },
        background: {
          padding: 10
        }
      },
      legend: {
        show: true,
        position:'top',
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return '₹ ' + formattedValue
          }
        }
      }
    };

    this.CarbonChart = {
      series: [
        {
          name: 'kWh',
          data: []
        },
      ],

      chart: {
        height: '99%',
        width: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
      },

      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: false,
          rangeBarOverlap: false,
          dataLabels: {
            position: 'top',
          }
        }
      },
      theme: {
        monochrome: {
          enabled: true,
          color: '#6ECB63',
          shadeTo: 'dark',
          shadeIntensity: 0.55
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -17,
        formatter:(val:any)=> {
          return this.formatNumber(val)
        },
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"],
          fontSize: '10px',
        },
        background: {
          padding: 10
        }
      },
      legend: {
        show: true,
        position:'top',
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + ' kg CO2'
          }
        }
      }
    };

    this.peakOffpeakchartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
        zoom: {
          enabled: false
        }
      },

      plotOptions: {
        bar: {
          columnWidth: "25%",
          distributed: false,
          dataLabels: {
            position: 'top',
          },
        }
      },

      dataLabels: {
        enabled: true,
        formatter:(val:any)=> {
          return this.formatNumber(val)
        },
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"],
          fontSize: '12px',
        },
        offsetY:-17
      },

      legend: {
        show: true,
        position:'top',
        fontSize: '12px',
        fontFamily: 'SharpSans, sans-serif',
      },

      grid: {
        show: true,
      },

      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + ' KVA'
            }
          }
        }
    };

  }

  getCellStyle(thisYear: number, lastYear: number): any {
    const percentage = this.CarbonPercentage(thisYear, lastYear);
  
    if (percentage > 100) {
      return { 'font-size': '14px', 'color': 'red' };
    } else {
      return { 'font-size': '14px', 'color': 'green' };
    }
  }
  

  formatNumber(num:number) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'k';
    } else {
        return num.toString();
    }
  }

  peakLoad = false
  peakvsOffData:any[] = []

  peakPostdata(payload:any){
    console.log(payload)
    this.ApiData.Postdata('clusterpvsop', payload).subscribe(
      res=>{
        this.peakvsOffData = res
        let peak=[], offpeak=[], categories=[]
        for(let i=0;i<this.peakvsOffData.length;i++){
          peak.push(this.peakvsOffData[i].peak)
          offpeak.push(this.peakvsOffData[i].offpeak)
          categories.push(this.peakvsOffData[i].plantname)
        }
        this.peakOffpeakchartOptions.series = [
          {
            name: 'Peak',
            data: peak
          },
          {
            name: 'Offpeak',
            data: offpeak
          }
        ]
        this.peakOffpeakchartOptions.title = { text: ``, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
        this.peakOffpeakchartOptions.xaxis.categories = categories
        this.peakLoad = false
      }
    )
  }

  PeakOffpeakGetData(value:any, type:string){
    this.peakLoad = true
    if(type === 'Date'){
      const date = this.datePipe.transform(value, 'yyyy-MM-dd');
      let payload = {
        plants:this.plants,
        Type: 'Date basis',
        Date: date,
        Month:null,
        Year:null
      }
      this.peakPostdata(payload)
    }
    else{
      const month = this.datePipe.transform(value, 'MM');
      const year = this.datePipe.transform(value, 'yyyy');
      let payload = {
        plants:this.plants,
        Type: 'Month basis',
        Date: null,
        Month:month,
        Year:year
      }
      this.peakPostdata(payload)
    }
  }

  secplantNames:any[] = []
  SecLoad:boolean = false;
  maxDate = new Date();
  kvamaxdate = new Date()
  popmaxdate = new Date()
  defaultDate = new Date();
  KvaDefaultDate = new Date();
  peakoffpeakDate = new Date();
  seriesData:any[] = []
  secData:any

  GetYearSECData(val:any){
    if(val){
      this.SecLoad = true
      const year = this.datePipe.transform(val, 'yyyy');
      let FormData = {
        year: year,
        plantname: this.secplantNames
      }
      this.seriesData = []
      let text = 'SEC DATA FOR '+this.secplantNames+' IN YEAR '+ year
      this.ApiData.SECPostData('secsupercluster', FormData).subscribe(
        res => {
          if(this.form.valid){
            this.secData = res
            for(let i = 0; i < this.secData.length; i++){
              this.seriesData.push(
                {
                  type: 'area',
                  name: this.secData[i].plantname,
                  data: this.secData[i].secData
                }
              )
            }
            this.ChartOptionsUpdate(text)
            this.SecLoad = false
          }
        }
      )
    }
  }

  defaultplant!:string
  defaultType = "Date basis"
  GetDataEnergy(){
    this.ApiData.getData(this.endpoint).subscribe(
      res => {
        this.cluData = res
        let len = this.cluData.length
        for(let i=0; i<len; i++){
          this.secplantNames.push(this.cluData[i].plantname)
        }
        this.plants = this.secplantNames
        this.defaultplant = this.secplantNames[0]
        this.kvaform.controls['plant'].setValue(this.defaultplant )
        this.GetYearSECData(this.maxDate)
        this.UpdateEnergyChart(len)
        this.UpdateCarbonChart(len)
        this.ovarallTotal()
        this.PeakOffpeakGetData(this.popmaxdate,'Date')
        if(this.firsttimeLogin === '1'){
          setTimeout(() => {
            this.confirmation.confirm({
              message: `Hello ${this.Username}, Do you need a tour?`,
              icon: 'pi pi-info-circle',
              accept: () => {
                this.Cookie.delete('firstlog')
                this.Cookie.set('firstlog', '0')
                this.startTour();
              }
            });
          }, 2000);
        }
        this.load = false
      },
      error =>{
        
      }
    )
  }

  ovarallTotal(){
    let len = this.cluData.length
    let SumofEnergyThisMonth=0, SumofEnergyLastMonth=0, SumofCostThisMonth=0, SumofCostLastMonth=0,
    SumofCarbonEmiThisYer=0, SumofCarbonEmiLastYer=0, res
    for(let i=0; i<len; i++){
      SumofEnergyThisMonth += this.cluData[i].EnergyManagement.EnrTotThisMonth
      SumofEnergyLastMonth += this.cluData[i].EnergyManagement.EnrTotLastMonth
      SumofCostThisMonth += this.cluData[i].cost.ThisMonthCost
      SumofCostLastMonth += this.cluData[i].cost.LastMonthCost
      SumofCarbonEmiThisYer += this.cluData[i].CorbonEmission.CoThisYear
      SumofCarbonEmiLastYer += this.cluData[i].CorbonEmission.CoLastYear
    }
    res = {
      ThisMonth: SumofEnergyThisMonth,
      LastMonth: SumofEnergyLastMonth,
      CostThisMonth: SumofCostThisMonth,
      CostLastMonth: SumofCostLastMonth,
      CarbonThisYear: SumofCarbonEmiThisYer,
      CarbonLastYear: SumofCarbonEmiLastYer
    }

    return res

  }

  CarbonPercentage(thisYear:number, lastYear:number):number{
    let res = (thisYear/lastYear)*100
    return res
  }


  platEndpoint = 'plantlatlon'
  maskload = false

  OpenPlantDashboard(plantname:string, location:string){
    console.log('Working')
    this.maskload = true
    this.Cookie.delete('plantname')
    this.Cookie.delete('type')
    this.Cookie.delete('location')
    this.Cookie.delete('lat')
    this.Cookie.delete('lon')
    this.ApiData.GetPlantDetails(this.platEndpoint, plantname).subscribe(
      res=>{
        this.maskload = false
        this.Cookie.set('plantname', plantname)
        this.Cookie.set('type', 'BASE-ADMIN')
        this.Cookie.set('Auth_Admin', 'CLUSTER-ADMIN')
        this.Cookie.set('location', location)
        this.Cookie.set('lat', res.lat)
        this.Cookie.set('lon', res.lon)
        this.router.navigate(['/dashboard/energy-consumption'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' });
      },
      error=>{
        this.maskload = false
      }
    )
    
  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }

  UpdateEnergyChart(length:number){
    let plantNames = []
    let todayCon = []
    let thisMonCon = []
    let LasMonCon = []
    let LsatYer = []
    let thisYearCon = []
    let CurMonCost = []
    let ThisMonCost = []
    let LastMonCost = []
    let ThisyerCost = []
    let LastYerCost = []
    for(let i=0; i<length; i++){
      plantNames.push(this.cluData[i].plantname)

      todayCon.push(this.cluData[i].EnergyManagement.EnrTotToday)
      thisMonCon.push(this.cluData[i].EnergyManagement.EnrTotThisMonth)
      LasMonCon.push(this.cluData[i].EnergyManagement.EnrTotLastMonth)
      thisYearCon.push(this.cluData[i].EnergyManagement.EnrTotThisYear)
      LsatYer.push(this.cluData[i].EnergyManagement.EnrTotLastYear)

      CurMonCost.push(this.cluData[i].cost.TotTodayCost)
      ThisMonCost.push(this.cluData[i].cost.ThisMonthCost)
      LastMonCost.push(this.cluData[i].cost.LastMonthCost)
      ThisyerCost.push(this.cluData[i].cost.ThisYearCost)
      LastYerCost.push(this.cluData[i].cost.LastYearCost)
    }

    let Series = [
      {
        name: 'Today',
        data: todayCon
      },
      {
        name: 'This Month',
        data: thisMonCon
      },
      {
        name: 'Last Month',
        data: thisMonCon
      },
      {
        name: 'This Year',
        data: LsatYer
      },
      {
        name: 'Last Year',
        data: thisYearCon
      }
    ]

    let costSeries = [
      {
        name: 'Today',
        data: CurMonCost
      },
      {
        name: 'This Month',
        data: ThisMonCost
      },
      {
        name: 'Last Month',
        data: LastMonCost
      },
      {
        name: 'This Year',
        data: ThisyerCost
      },
      {
        name: 'Last Year',
        data: LastYerCost
      }
    ]
    let width = '100%'
    if(length > 10){
      let calc = length * 25
      width = `${calc}%`
    }
    let Coswidth = '100%'
    this.EnrchartOptions.series = Series
    this.EnrchartOptions.xaxis.categories = plantNames
    this.EnrchartOptions = {
      ...this.EnrchartOptions,
      chart: {
        ...this.EnrchartOptions.chart,
        width: width,
      }
    }

    this.EnrCostchartOptions.series = costSeries
    this.EnrCostchartOptions.xaxis.categories = plantNames
    this.EnrCostchartOptions = {
      ...this.EnrCostchartOptions,
      chart: {
        ...this.EnrCostchartOptions.chart,
        width: Coswidth,
      }
    }
  }

  UpdateCarbonChart(length:number){
    let plantNames = []
    let TotEmiss = []
    let s1 = []
    let s2 = []
    let s3 = []
    let cothisYer = []
    let coLastYer = []

    for(let i=0; i<length; i++){
      plantNames.push(this.cluData[i].plantname)
      TotEmiss.push(this.cluData[i].CorbonEmission.CoTotThisMonth)
      s1.push(this.cluData[i].CorbonEmission.CoS1)
      s2.push(this.cluData[i].CorbonEmission.CoS2)
      s3.push(this.cluData[i].CorbonEmission.CoS3)
      cothisYer.push(this.cluData[i].CorbonEmission.CoThisYear)
      coLastYer.push(this.cluData[i].CorbonEmission.CoLastYear)
    }

    let Series = [
      {
        name: 'Total Emission',
        data: TotEmiss
      },
      {
        name: 'Scope1',
        data: s1
      },
      {
        name: 'Scope2',
        data: s2
      },
      {
        name: 'Scope3',
        data: s3
      },
      {
        name: 'This Year',
        data: cothisYer
      },
      {
        name: 'Last Year',
        data: coLastYer
      }
    ]

    let width = '100%'
    if(length > 10){
      let calc = length * 30
      width = `${calc}%`
    }
    this.CarbonChart.series = Series
    this.CarbonChart.xaxis.categories = plantNames
    this.CarbonChart = {
      ...this.CarbonChart,
      chart: {
        ...this.CarbonChart.chart,
        width: width,
      }
    }

  }


  // Highchart Options

  ChartOptionsUpdate(TextValue:string){
    const color0 = Highcharts.getOptions()?.colors?.[0] || 'defaultColor';
    const rgba = Highcharts.color(color0).setOpacity(0).get('rgba') || 'defaultRGBA';
    this.secChartOptions = {
      chart: {
        type: 'area',
        zoomType: 'x'
     },
      accessibility: {
          description: '',
      },
      title: {
          text: TextValue,
          style:{
            fontSize: 15,
          }
      },
      subtitle: {
          text: 'Drag in the plot area to zoom in',
          style:{
            fontSize: 12,
            color: '#da2020'
          }
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
            text: 'SEC'
        }
    },
      legend: {
        enabled: true
      },
      plotOptions: {
        area: {
          stacking: "normal",
          fillColor: {
              linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 0
              },
              stops: [
                  [0, color0],
                  [1, rgba]
              ]
          },
          marker: {
              radius: 2.5
          },
          lineWidth: 1.7,
          states: {
              hover: {
                  lineWidth: 1.8
              }
          },
          areaspline: {
            fillOpacity: 0.5
          },
          threshold: null
        }
    },
    tooltip: {
      shared: false,
      crosshairs: true,
      split: true,
      headerFormat: '<span style="font-size:12px"><b>{point.key:%d-%m-%Y}&nbsp;(SEC)</b></span><br>'
    },
    series: this.seriesData

    }
  }


}
