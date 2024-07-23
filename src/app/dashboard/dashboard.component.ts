import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { faBattery3, faIndianRupee, faBolt, faLessThanEqual, faArrowUpRightDots, faLightbulb, faPlugCircleBolt, faV, faPlug, faWaveSquare, faPlugCircleCheck, faArrowTrendUp, faArrowTrendDown, faBattery5, faTowerCell } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from './dashboard.service'
import { Source } from '../settings/Data'
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service'
import { Subscription, interval } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import highcharts3D from 'highcharts/highcharts-3d';
import Histogram from 'highcharts/modules/histogram-bellcurve';
import More from 'highcharts/highcharts-more'
import Cylinder from 'highcharts/modules/cylinder';
More(Highcharts);
Histogram(Highcharts);
highcharts3D(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);
Cylinder(Highcharts);
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
  ApexTooltip,
  ApexAnnotations
} from "ng-apexcharts";
import { ActivatedRoute, Router } from '@angular/router';

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

import { Currency } from '../CurrencyData'
import { items } from 'fusioncharts';
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
  tooltip: ApexTooltip,
  annotations: ApexAnnotations
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})

export class DashboardComponent implements OnInit, AfterViewInit {

  public selectedSource: string = ''
  public selectedDataofMain: string = ''
  public selectedDynamic: string = 'pf'

  bat = faBattery3
  rup = faIndianRupee
  eng = faBolt
  bulb = faLightbulb
  arrow = faArrowUpRightDots
  tow = faTowerCell
  curr = faPlugCircleBolt
  vol = faV
  Rpow = faBattery5
  Apow = faPlug
  Vhar = faWaveSquare
  RecPow = faPlugCircleCheck
  maxA = faArrowTrendUp
  minA = faArrowTrendDown

  chartData:any
  groupChart:any
  load: boolean = true
  chartLoad = true
  StartUppage!: boolean
  

  selectChart!: Chart

  meterName: any[] = [];
  energyConsume: any[] = [];
  emissionConsume: any[] = []

  meternameOfIncomer: any[] = [];
  energyStoreIncomer: any[] = [];
  emissionStoreIncomer: any[] = []

  stateOptionsEms: any[] = [
    {
      label: 'HOURLY COST (TODAY)', value: 'live', icon: 'fi fi-rr-time-forward'
    }, 
    {
      label: 'MONTH/YEAR SELECTION', value: 'month', icon: 'fi fi-rs-calendar'
    }
  ];

  value: string = 'live';


  //  BARCHART
  
  public GroupChartOptions: any
  public MeterChartOptions:any
  public percentageChartOptions:any
  public GrpShiftChartOptions: any
  public ScrShiftChartOptions: any

  public pfChartOptions:any
  public DynamicChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;


  public areachartTrans: Partial<ChartOptions> | any;
  public CostMixedChart: Partial<ChartOptions> | any
  public SECChart: Partial<ChartOptions> | any
  public COEChart: Partial<ChartOptions> | any 

  // costData form
  formTypeCost: FormGroup
  formPerTypeCost:FormGroup
  formMonthCost: FormGroup
  formYearCost: FormGroup
  seleter: any[] = ['Month Basis', 'Year Basis']
  Perseleter: any[] = ['Date Basis', 'Month Basis', 'Year Basis']
  shiftwiseOpt:any[] = [
    {
      name:'Today',
      value: 'today'
    },
    {
      name:'Yesterday',
      value: 'yesterday'
    },
    {
      name: 'This Month',
      value: 'thismonth'
    }
  ]
  defafulselecter = 'Month Basis'
  DefaultPercentageSelector = 'Date Basis'
  maxDate = new Date();
  DefaultDate = new Date();
  CostPerDefaultDate = new Date()
  PflogDefaultDate = new Date();
  DynamicDefaultDate = new Date();
  CoeperDefaultDate = new Date();
  flowDefaultDate = new Date();

  // SEC DATA FORM
  SECform: FormGroup
  plLogForm: FormGroup
  DynamicPowForm: FormGroup
  coePerForm: FormGroup
  FlowChartForm: FormGroup
  SwitchForm: FormGroup
  shiftForm:FormGroup

  public CurrencyType:any

  constructor( private ChartApi: DashboardService, private Message: MessageService, private Cookie: CookieService, private datePipe: DatePipe, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef ) {

    this.sourcecostForm = new FormGroup({
      source: new FormControl('', Validators.required)
    })

    this.shiftForm = new FormGroup({
        selectedday: new FormControl('', Validators.required)
    })

    this.formPerTypeCost = new FormGroup({
      selectedType: new FormControl('', Validators.required),
      date: new FormControl(''),
      month: new FormControl(''),
      year: new FormControl('')
    })

    this.formTypeCost = new FormGroup({
      selectedType: new FormControl('', Validators.required),
    })

    this.formMonthCost = new FormGroup({
      selectMonth: new FormControl('',Validators.required)
    });

    this.formYearCost = new FormGroup({
      selectYear: new FormControl('',Validators.required)
    });

    this.SECform = new FormGroup({
      selectMonth: new FormControl('',Validators.required)
    })

    this.plLogForm = new FormGroup({
      selectDate: new FormControl('',Validators.required)
    })

    this.DynamicPowForm = new FormGroup({
      chartname: new FormControl('',Validators.required),
      date: new FormControl('',Validators.required)
    })

    this.coePerForm = new FormGroup({
      date: new FormControl('',Validators.required),
      chartname: new FormControl('',Validators.required)
    })

    this.FlowChartForm = new FormGroup({
      selectMonth: new FormControl('',Validators.required)
    })

    this.SwitchForm = new FormGroup({
      value: new FormControl('',Validators.required)
    })

    // Linechart
    this.areachartTrans = {
      series: [],

      chart: {
        type: "area",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Hourly Consumption Cost`,
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
        categories: ['06.00', '07.00', '08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00', '20.00', '21.00', '22.00', '23.00', '24.00', '01.00', '02.00', '03.00', '04.00', '05.00'],
        floating:false,
        labels: {
          show: true,
          rotate: -50,
          rotateAlways: true,
          style: {
            fontSize: "10px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        opposite: false
      },
      legend: {
        horizontalAlign: "left"
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return `${this.CurrencyType} ` +formattedValue
          }
        }
      }
    };

    this.CostMixedChart = {
      series: [],
      chart: {
        type: "area",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        stacked: true,
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Cost and Energy Consumption (${this.Cookie.get('plantname')})`,
            }
          }
        },
      },
      grid: {
        show: false
      },

      dataLabels: {
        enabled: false,
      },

      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: false,
          dataLabels: {
            position: 'bottom',
            offsetY:-17
          },
        }
      },

      fill:{
        opacity: 0.8,
        type: 'solid',
      },

      xaxis: {
        categories: [],
        floating:false,
        labels: {
          show: true,
          // rotateAlways: true,
          style: {
            fontSize: "10.2px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        opposite: false
      },
      legend: {
        show: true,
        position:'top',
      },

      tooltip: {
        y: {
          formatter: (value:any, { seriesIndex, w, dataPointIndex }: {seriesIndex: number, w:any, dataPointIndex:any}) => {
            let category = w.globals.categoryLabels
            let selectName = category[dataPointIndex]
            let formattedValue = value.toLocaleString();
            if(seriesIndex === 0){  
              return formattedValue + this.UnitsforCostChart(selectName)
            }
            else{
              return `${this.CurrencyType} ` + formattedValue
            }
          },
        }
      }
    };

    // SEC CHART
    this.SECChart = {
      series: [],
      chart: {
        type: "area",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `SEC Chart (${this.Cookie.get('plantname')})`,
            }
          }
        },
      },
      annotations:{
        yaxis:[
          {
            y: 1.5,
            strokeDashArray: 0,
            borderColor: "#416D19",
            label: {
              borderColor: "#416D19",
              style: {
                color: "#fff",
                background: "#416D19"
              },
              text: "Best SEC (1.5)"
            }
          }
        ]
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
          show: true,
          // rotate: -50,
          style: {
            fontSize: "10px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        opposite: false
      },
      legend: {
        horizontalAlign: "left"
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue
          }
        }
      }
    };

    // COE PERCENTAGE CHART
    this.COEChart = {
      series: [],
      chart: {
        type: "line",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Cost Percentage Chart (${this.Cookie.get('plantname')})`,
            }
          }
        },
      },
      stroke: {
        width: 2.2,
        curve: "smooth"
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
          show: true,
          rotate: -50,
          rotateAlways: true,
          style: {
            fontSize: "10px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        opposite: false
      },
      legend: {
        horizontalAlign: "left"
      },
      tooltip: {
        x: {
          formatter: (value:any)=>{
            return this.ReturnTotCoe(value)
          }
        },
        y: {
          formatter: (value:any,{ series, seriesIndex, dataPointIndex, w }:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + '%' + this.CosingDis(seriesIndex, dataPointIndex)
          }
        }
      }
    };

  }

  CosingDis(seriesIndex:number, dataPointIndex:number){
    let ApiSeries = this.CoeCostPerData.costing
    let Data = ApiSeries[seriesIndex]
    return ` (${this.CurrencyType}${Data.data[dataPointIndex].toFixed(2)})`
  }

  CoeCostPerLoad = false
  dropDownvis = false
  CoeCostPerData:any
  CoeCostingdata:any[] = []
  CompareOptions:any[] = []
  COEselectedDetails:any[] = []
  SelectedCoeSrc = ''
  ngModalValue:any

  ReturnTotCoe(value:number){
    let TotalCostHour = this.CoeCostPerData.totalcost[value-1]
    return `${this.CoeCostPerData.label[value-1]} - Total Cost: ${this.CurrencyType}${TotalCostHour.toFixed(2)}`
  }

  GetCoePerData(date:any){
    this.CoeCostPerLoad = true
    this.dropDownvis = false
    this.COEselectedDetails = []
    let FormateDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    let DateFormate = this.datePipe.transform(date, 'dd-MM-yyyy');
    this.ChartApi.PflogGet('srchourcost', FormateDate).subscribe(
      res=>{
        this.CoeCostPerData = res
        let ApiSeries = this.CoeCostPerData.costing, TotSeries = this.CoeCostPerData.totalcost
        let ChartSeries = []
        this.CompareOptions = []
        this.CoeCostingdata = []
        this.ngModalValue = []
        for(let i=0;i<ApiSeries.length;i++){
          this.ngModalValue.push(ApiSeries[i].name)
          this.CompareOptions.push({
            name: ApiSeries[i].name
          })
          this.CoeCostingdata.push({
            name: ApiSeries[i].name,
            data: this.COEChartdataFeed(ApiSeries[i].data, TotSeries)
          })
        }
        // console.log(this.ngModalValue)
        this.COEselectedDetails = [
          {
            name:this.CompareOptions[0].name
          }
        ]
        this.dropDownvis = true
        this.SelectedCoeSrc = this.CompareOptions[0].name
        this.COEChart.xaxis.categories = this.CoeCostPerData.label
        this.OnCoeSrcSelect(this.ngModalValue, "res")
        this.COEChart.title = { text: `HOURLY COST PERCENTAGE FOR ${DateFormate}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
        
      }
    )
  }

  OnCoeSrcSelect(value:any, method:string){
    let ApiSeries = this.CoeCostingdata
    let ChartSeries:any[] = []
    this.COEselectedDetails = this.ngModalValue
    if(value == this.SelectedCoeSrc){
      ChartSeries.push(ApiSeries.find((item:any)=>{
        if(item.name == value){
          return item
        }
      }))
    }
    else{
      let SelectValue = value.value
      if(method=='Onclick'){
        SelectValue = value.value
      }
      else{
        SelectValue = value
      }
      // console.log(SelectValue, value)
      for(let i=0; i<SelectValue.length;i++){
        ChartSeries.push(ApiSeries.find((item:any)=>{
          if(item.name == SelectValue[i]){
            return item
          }
        }))
      }
    }
    this.COEChart.series = ChartSeries
    this.CoeCostPerLoad = false
  }

  COEChartdataFeed(data:any, totdata:any){
    let result = [], percentage
    for(let i=0; i<data.length; i++){
      percentage = (data[i] / totdata[i]) * 100
      if(isNaN(percentage)){
        result.push(0)
      }
      else{
        result.push(percentage.toFixed(2))
      }
    }
    return result
  }

  UnitsforCostChart(name: string): string {
    if(name==='Transformer' || name==='Wind' || name==='Solar Energy'){
      return ' kWh';
    }
    else if(name==='PNG' || name==='CNG' || name==='LPG'){
      return ' Kg';
    }
    else if(name==='Diesel' || name==='Petrol' || name==='Water'){
      return ' L';
    }
    else{
      return ''
    }
  }

  genRandomcolors(length: number) {
    let colors = []
    for (var i = 0; i < length; i++) {
      const randomColor = this.getRandomLightColor();
      colors.push(randomColor)
    }
    return colors
  }

  getRandomLightColor() {
    // return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    var letters = 'ABCDEF0123456789'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  GroupUpdateChart(xcategory:any, series:any){
    this.GroupChartOptions = {
      chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 7,
            beta: -10,
            depth: 50,
            viewDistance: 100
        }
      },
      title: {
        text: '',
      },
      colors: [
        '#7cb5ec',
        '#434348',
        '#90ed7d',
        '#f7a35c',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#2b908f',
        '#f45b5b',
        '#91e8e1'
      ],
      xAxis: {
        categories: xcategory,
        labels:{
          style:{
            fontSize:'11px',
            color:"#000000"
          }
        }
      },
      yAxis: {
          title: {
              enabled: false
          }
      },
      tooltip: {
          headerFormat: '<b>{point.key}</b><br>',
          pointFormat: 'Energy Consumption: {point.y:,.0f} kWh',
          valueSuffix: ' kWh',
      },
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          depth: 55,
          events:{
            click: (event:any)=>{
              let seriesdata = []
              let SelestedGroup = event.point.category
              this.selectedDataofMain = SelestedGroup
              for(let i=0; i<this.groupChart.length; i++){
                if(this.groupChart[i].metergroup === SelestedGroup){
                  seriesdata.push({
                    name: this.groupChart[i].metername,
                    y: Number(this.groupChart[i].EnergyConsumed)
                  })
                }
              }
              let series = [
                {
                  colorByPoint: true,
                  data: seriesdata
                }
              ]
              this.MeterUpdateChart(series, SelestedGroup)
            }
          },
          dataLabels: {
            enabled: true,
            align: 'center',
            format: '<b>{point.y:,.0f}</b> kWh',
          }
        }
      },
      series: series
    }
  }


  MeterUpdateChart(series:any, title:string){
    
    this.MeterChartOptions = {
      chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 63,
            beta: 0
        },
        reflow: true,
        events:{
          render:() => {
            if(this.MeterChartOptions) {
              this.MeterChartOptions.reflow();
            }
          }
        }
      },
      colors: [
        '#7cb5ec',
        '#434348',
        '#90ed7d',
        '#f7a35c',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#2b908f',
        '#f45b5b',
        '#91e8e1'
      ],
      title: {
        text: '',
      },
      subtitle: {
        text: title,
        style:{
          color:"#da2020",
          fontWeight:'bold',
          fontSize: '14px'
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Energy Consumption: <p>{point.y:,.2f} kWh</p>',
        valueSuffix: ' kWh',
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
      },
      series: series
    }
  }

  UpdateGrpShiftChartFun( title:string, colors:any, xCata:any, Series: any):any{
     this.GrpShiftChartOptions = {
      chart: {
        type: 'cylinder',
        options3d: {
            enabled: true,
            alpha: 12,
            beta: -5,
            depth: 80,
            viewDistance: 100
        }
      },
      colors:colors,
      title: {
        text: '',
      },
      legend:{
        enabled: true,
        verticalAlign: 'top',
      },
      xAxis: {
        categories: xCata,
        labels:{
          style:{
            fontSize:'11px',
            color:"#000000"
          }
        }
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      tooltip: {
          headerFormat: '<b>{point.key}</b><br>',
          pointFormat: 'Energy Consumption: {point.y:,.0f} kWh',
          valueSuffix: ' kWh',
      },
      plotOptions: {
        cylinder: {
          depth: 55,
          dataLabels: {
            enabled: false,
            align: 'center',
            format: '<b>{point.y:,.0f}</b> kWh',
          }
        }
      },
      series: Series
    }
  }


// ----------------------
  Consumption!:number
  PowerFactor!:number
  MaxmumDemand!:number
  // Frequency!:number

  energyData:any

  SolarCon: number = 0
  SolarCost: number = 0
  Dgcon: number = 0
  DgCost: number =0
  WindCon: number = 0
  WindCost: number = 0
  EBCon: number = 0
  EBCost: number = 0
  ThirdCon: number = 0
  ThirdCost: number = 0
  PowTCon: number = 0
  PowTCost: number = 0

  date = new Date();
  formattedDate = `${this.date.getFullYear()}-${(this.date.getMonth() + 1).toString().padStart(2, "0")}-${this.date.getDate().toString().padStart(2, "0")}`;

  costLoad!: boolean;
  costEnergyData:any
  BaseString = ''
  FormTypeStr: any
  endpointcostData = 'plantcost'
  endpointSEC = 'secchart'
  Costchartvisible = false

  Circlechart!: Highcharts.Chart;
  donchartOptions!:any
  piechartOptions!:any
  donutchartData : any[] = []
  piechartData1 : any[] = []
  sourcecostForm!:FormGroup;

  SECData:any
  secload = false
  FormTypeSEC = ''
  weatherData:any
  CurCode:string = ''

  ngOnInit() : void{
    this.sub = this.route.queryParams.subscribe(params => {
      this.CurCode = params['Currency']
      this.CurrencyType = this.GetCurrencyData(params['Currency']);
    });
    this.shiftForm.get('selectedday')?.setValue('today')
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });
    this.DynamicPowForm.get('chartname')?.setValue(this.selectedDynamic)
    this.StartUppage = true
    window.scroll(0,0)
    this.CallSourceNames()
    this.getChartData()
    this.updateorgDataArray(this.flowDefaultDate)
    this.getMaxDate()
    this.GetMonthSECtData(this.DefaultDate)
    this.GetMonthCostData(this.DefaultDate)
    this.formPerTypeCost.get('selectedType')?.setValue('Date Basis')
    this.GetCoePerData(this.CoeperDefaultDate)
    this.GetPercentageCostData('date', this.CostPerDefaultDate)
    // this.selectedSource = 'EB'
    // this.getAreChartData(this.selectedSource)
  }

  ShiftWiseData:any
  ShiftInputChangeData:any

  ShiftInputChanges(value:any){
    this.ShiftInputChangeData = []
    if(value == 'today'){
      const todayValues = this.ShiftWiseData.map((item: any) => item.today);
      this.ShiftInputChangeData = todayValues
      // console.log(this.ShiftInputChangeData)
    }
    else if(value == 'yesterday'){
      const yesterdayValues = this.ShiftWiseData.map((item: any) => item.yesterday);
      this.ShiftInputChangeData = yesterdayValues
    }
    else if(value == 'thismonth'){
      const thismonthValues = this.ShiftWiseData.map((item: any) => item.thismonth);
      this.ShiftInputChangeData = thismonthValues
    }
  }

  getMaxDate(): Date {
    return new Date();
  }

  ngAfterViewInit(): void {
    interval(60000).subscribe(() => {
      if(this.router.url === `/dashboard/energy-consumption?Currency=${this.CurCode}`){
        // console.log('Dashboard correct url')
        this.StartUppage = false
        this.chartData = null
        this.getChartData();
        // this.sourcecostForm.patchValue({
        //   source: this.selectedSource
        // })
      }
      // console.log(this.sourcecostForm.value)
      // this.GetMonthCostData(this.DefaultDate)
    });
  }

  


  GetMonthSECtData(value:any){
    // console.log(value)
    if(value){
      this.secload = true
      var name = value
      var Month = this.datePipe.transform(name, 'M/yyyy');
      var MonthNam = this.datePipe.transform(name, 'MMMM YYYY');
      var [month, Year] = Month?.split('/') ?? [];
      this.FormTypeSEC = `${MonthNam?.toUpperCase()}`;
      const FormData ={
        Month: month,
        Year: Year
      }
      // console.log(FormData)
      this.ChartApi.SECPostData(this.endpointSEC, FormData).subscribe(
        res =>{
          this.SECData = res
          let SECchartSeries = [
            {
              name: "SEC",
              data: this.SECData.SEC_value
            }
          ]
          this.SECChart.series = SECchartSeries
          this.SECChart.xaxis.categories = this.SECData.Date
          this.SECChart.title = { text: `SEC DATA FOR MONTH ${this.FormTypeSEC}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
          this.secload = false
        }
      )
    }
  }

  GetMonthCostData(value:any){
    if(value){
      // console.log(value)
      this.costLoad = true
      this.Costchartvisible = false
      var name = value
      var Month = this.datePipe.transform(name, 'M/yyyy');
      var MonthNam = this.datePipe.transform(name, 'MMMM YYYY');
      var [month, Year] = Month?.split('/') ?? [];
      this.BaseString = 'MONTH'
      this.FormTypeStr = `${MonthNam?.toUpperCase()}`;
      const FormData ={
        Type : "Month Basis",
        Month: month,
        Year: Year
      }
      // console.log(FormData);
      this.costEnergyData = []
      this.formYearCost.controls['selectYear']?.setValue(null)
      this.ChartApi.CostPostData(this.endpointcostData, FormData).subscribe(
        res => {
          this.costEnergyData = res
          let series = [
            {
              name: "Consumption",
              type: "column",
              data: this.costEnergyData.Energydata
            },
            {
              name: "Cost",
              type: "line",
              data: this.costEnergyData.Costdata
            }
          ]
          this.CostMixedChart.series = series
          this.CostMixedChart.xaxis.categories = this.costEnergyData.Source_name
          this.CostMixedChart.title = { text: `CONSUMPTION & COST DATA FOR ${this.BaseString} ${this.FormTypeStr}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
          this.costLoad = false
          this.Costchartvisible = true
        }
      )
    }
  }

  GetYearCostData(value:string){
    if(value){
      this.costLoad = true
      this.Costchartvisible = false
      const year = this.datePipe.transform(this.formYearCost.get('selectYear')?.value, 'yyyy');
      this.BaseString = 'YEAR'
      this.FormTypeStr = `${year}`;
      this.formYearCost.get('selectYear')?.setValue(year)
      const FormData ={
        Type : this.formTypeCost.controls['selectedType'].value,
        Month: null,
        Year: year
      }
      // console.log(FormData)
      this.costEnergyData = []
      this.ChartApi.CostPostData(this.endpointcostData, FormData).subscribe(
        res => {
          this.costEnergyData = res
          let series = [
            {
              name: "Consumption",
              type: "column",
              data: this.costEnergyData.Energydata
            },
            {
              name: "Cost",
              type: "line",
              data: this.costEnergyData.Costdata
            }
          ]
          this.CostMixedChart.series = series
          this.CostMixedChart.xaxis.categories = this.costEnergyData.Source_name
          this.CostMixedChart.title = { text: `CONSUMPTION & COST DATA FOR ${this.BaseString} ${this.FormTypeStr}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
          this.costLoad = false
          this.Costchartvisible = true
        }
      )
    }
  }

  onDropdownChange(event:any) {
    let value = event || this.selectedSource
    if (value){
      // this.getAreChartData(value)
    }
    else{
      this.areachartTrans.series = [];
      this.areachartTrans.xaxis.categories = [];
    }
  }

  perCostload = false
  PerCostData:any

  GetPercentageCostData(type:string, date:any){
    this.perCostload = true
    let payload, Selectedtype = this.formPerTypeCost.get('selectedType')?.value, formateStr:any
    let Formatedate = this.datePipe.transform(date, 'yyyy-MM-dd'), formateMonth = this.datePipe.transform(date, 'MM'), formateYear = this.datePipe.transform(date, 'yyyy')
    let strMonth = this.datePipe.transform(date, 'MMMM-yyyy')
    payload = {
      type: Selectedtype,
      date: Formatedate,
      month:formateMonth,
      year:formateYear
    }
    if(type=='date'){
      formateStr = Formatedate?.toString()
    }
    else if(type=='month'){
      formateStr = strMonth
    }
    else if(type=='year'){
      formateStr = formateYear
    }
    this.ChartApi.CostPostData('coechart', payload).subscribe(
      res => {
        this.PerCostData = res
        let total = 0
        for(let i=0;i<this.PerCostData.length;i++){
          total += this.PerCostData[i].data
        }
        let perDataChart = this.PerCostData.map(
          (item:any) => {
            return {
              name: item.name + this.FormateDataLable(item.data, total),
              y: item.data
            }
          }
        )
        let Series = [
          {
            name: 'Share',
            data: perDataChart
          }
        ]
        this.perCentageCostChart(`COST PERCENTAGE FOR ${(formateStr.toLocaleString()).toUpperCase()}`, Series)
        this.perCostload = false
      }
    )
  }

  FormateDataLable(value: any, totv: any) {
    let percentage = (value / totv) * 100;
    let result = ` (${percentage.toFixed(2)}%)`;
    if (isNaN(percentage)) {
        return ' (0%)'
    }
    else{
      return result
    }
}


  perCentageCostChart(HeaderText:string, series:any){
    this.percentageChartOptions = {
      chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 63,
            beta: 0
        },
        reflow: true,
        events:{}
      },
      colors: [
        '#7cb5ec',
        '#90ed7d',
        '#f7a35c',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#2b908f',
        '#f45b5b',
        '#91e8e1'
      ],
      title: {
        text: '',
      },
      subtitle: {
        text: HeaderText,
        style:{
          color:"#da2020",
          fontWeight:'bold',
          fontSize: '14px'
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: `Cost: ${this.CurrencyType}` + '<p>{point.y:,.2f}</p>',
        valueSuffix: ' kWh',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 50,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            distance: 15,
          }
        }
      },
      series: series
    }
  }

  

  areachartData: any
  pieChartData: any

  data: TreeNode<any>[] = [];
  Endpoint = 'overviewdashboard'
  endpointAreChirt = 'sourcecost'
  endpointPieChart = 'sourcecost'
  endpointScr = 'sourcemanagement'
  dropSourceData: Source[] = []
  metersrc:any
  CardsData:any

  CallSourceNames(){
    this.ChartApi.getData(this.endpointScr).subscribe(
      res => {
        this.dropSourceData = res
        this.metersrc = this.dropSourceData.map((data) => ({ name: data.assourcename }));
        this.selectedSource = this.metersrc[0].name
        // this.getAreChartData(this.selectedSource)
    });
  }
  private sub!: Subscription;

  message = ''
  ShowTry = false

  TryAgain(){
    this.load = true
    this.ShowTry = false
    this.getChartData()
  }

  GetCurrencyData(value:string):any{
    const findsymbol = Currency.find((item)=> item.code === value)
    return findsymbol?.symbol 
  }

  BackUpChartdata:any

  getChartData(){
    // this.ChartApi.PieCGetData(this.endpointPieChart, this.formattedDate).subscribe(
    //   res => {
    //   this.pieChartData = res
    //   this.piechartData1 = []
    //   for(let i=0; i < this.pieChartData.data.length; i++){
    //     let DataRan = {
    //       name: this.pieChartData.label[i],
    //       y: this.pieChartData.data.map(Number)[i]
    //     }
    //     this.piechartData1.push(DataRan)
    //   }
    //   this.PieChartOpt()
    // });

    if(!this.StartUppage){
      // this.getAreChartData(this.selectedSource)
    }
    
    this.ChartApi.getData(this.Endpoint).subscribe(
      data =>{
        this.chartData = data;
        this.ShiftWiseData = this.chartData.srcname
        this.CardsData = data.power_details
        this.UpdateCardsDetails(this.CardsData)
        this.groupChart  = this.chartData.grpmtrname
        this.updatamainchart()
        this.updateModChart()
        this.updateSrcChart()
        this.UpdateGrpShift()
        if(this.StartUppage){
          this.GetDynamicPowData(this.DynamicDefaultDate)
        }
        this.load = false
      },
      error=>{
        if(error.status == 0){
          this.message = error.statusText
          this.ShowTry = true
        }
        else{
          this.load = false
          // this.message = error.statusText
          // console.log(error)
          this.chartData = {
            "groupname": [],
            "groupec": [],
            "s1energy": [],
            "s2energy": [],
            "s3energy": [],
            "srcname": [
                {
                    "name": "DG",
                    "today": [],
                    "yesterday": [],
                    "thismonth": []
                },
                {
                    "name": "Wind",
                    "today": [],
                    "yesterday": [],
                    "thismonth": []
                },
                {
                    "name": "Solar Energy",
                    "today": [],
                    "yesterday": [],
                    "thismonth": []
                },
                {
                    "name": "Transformer1",
                    "today": [],
                    "yesterday": [],
                    "thismonth":[]
                }
            ],
            "grpmtrname": [],
            "power_details": {
                "weekEnergy": "0",
                "CurHar1": "0",
                "CurHar2": "0",
                "CurHar3": "0",
                "VolHar1": "0",
                "VolHar2": "0",
                "VolHar3": "0",
                "AppPwr1": "0",
                "AppPwr2": "0",
                "AppPwr3": "0",
                "Recpwr1": "0",
                "Recpwr2": "0",
                "Recpwr3": "0",
                "TRecpwr": "0",
                "totRelpwr": "0",
                "Relpwr1": "0",
                "Relpwr2": "0",
                "Relpwr3": "0",
                "totCur": "0",
                "cur1": "0",
                "cur2": "0",
                "cur3": "0",
                "totVol": "0",
                "vol1": "0",
                "vol2": "0",
                "vol3": "0",
                "minpwrfctr": "0",
                "maxpwrfctr": "0",
                "mindemands": "0",
                "totDemands": "0",
                "monthEnergy": 0,
                "yesterEnergy": "0",
                "plantec": 0,
                "avgpwrfctr": "0",
                "maxdemands": "0",
                "avg_freq": "0"
            }
          }
        }
        this.ShiftWiseData = this.chartData.srcname
        this.CardsData = this.chartData.power_details
        this.UpdateCardsDetails(this.CardsData)
        this.groupChart  = this.chartData.grpmtrname
        this.updatamainchart()
        this.updateModChart()
        this.updateSrcChart()
        this.UpdateGrpShift()
        if(this.StartUppage){
          this.GetDynamicPowData(this.DynamicDefaultDate)
        }
      }
      
    );
  }

  // getAreChartData(value:string) {
  //   this.chartLoad = true;
  //   this.ChartApi.HorGetData(this.endpointAreChirt, value, this.formattedDate).subscribe(res => {
  //     this.areachartData = res;
  //     // console.log(this.areachartData)
  //     let arechart = [{
  //       name: 'Cost',
  //       data: this.areachartData.data
  //     }];
  //     this.areachartTrans.series = arechart;
  //     this.areachartTrans.xaxis.categories = this.areachartData.label;
  //     this.areachartTrans.title = { text: this.selectedSource, align: 'center', style:{ fontSize:'15px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
  //     this.chartLoad = false;
  //   });
  // }


  updatamainchart(){
    let mainchart = [
      {
        name: 'kWh',
        data: this.chartData.groupec,
        colorByPoint: true
      }
    ]
    this.GroupUpdateChart(this.chartData.groupname, mainchart)
  }

  updateModChart(){
    if(this.StartUppage){
      this.selectedDataofMain =  this.chartData.groupname[0]
    }
    let seriesdata = []
    for(let i=0;i<this.groupChart.length;i++)
    {
      if(this.chartData.grpmtrname[i].metergroup == this.selectedDataofMain){
        seriesdata.push({
          name: this.groupChart[i].metername,
          y: Number(this.groupChart[i].EnergyConsumed)
        })
      }
      let series = [
        {
          colorByPoint: true,
          data: seriesdata
        }
      ]
      this.MeterUpdateChart(series, this.selectedDataofMain)
    }
    
  }

  srcIndexDG:any
  srcIndexTrans:any
  srcIndexSolar:any
  updateSrcChart(){
    let srcseries =[
      {
        name: "Shift 1",
        data: this.chartData.srcs1energy
      },
      {
        name: "Shift 2",
        data: this.chartData.srcs2energy
      },
      {
        name: "Shift 3",
        data: this.chartData.srcs3energy
      },
    ]
    this.srcIndexSolar = this.ShiftWiseData.findIndex((item:any) => item.name === "Solar Energy");
    this.srcIndexTrans = this.ShiftWiseData.findIndex((item:any) => item.name === "Transformer1");
    this.srcIndexDG = this.ShiftWiseData.findIndex((item:any) => item.name === "DG");
    this.ShiftInputChanges('today')       
  }

  UpdateGrpShift(){
    let GrpShiftSeries = [
      {
        name: "Shift 1",
        data: this.chartData.s1energy
      },
      {
        name: "Shift 2",
        data: this.chartData.s2energy
      },
      {
        name: "Shift 3",
        data: this.chartData.s3energy
      },
    ]
    let getColors = this.genRandomcolors(3)
    this.UpdateGrpShiftChartFun('', getColors, this.chartData.groupname, GrpShiftSeries)
  }

  // PF HIGH CHARTS


  formateForChart(data:any){
    const formattedData = data.map(([time, y]: [string, number]) => {
      return  y;
    });
    
    return formattedData;
  }

  FormateForxAxix(data:any){
    const formattedcatagories = data.map(([time, y]: [string, number]) => {
      return time;
    });
    
    return formattedcatagories;
  }
  

  selectedDetails:any[] = []

  DynamicChartDropdown = [
    {
      name: 'Power Factor',
      value: 'powerfactor',
      units: ' cosϕ',
      disable: false
    },
    {
      name: 'KVA Demand',
      value: 'kva',
      units: ' KVA',
      disable: false
    },
    {
      name: 'Frequency',
      value: 'freq',
      units: ' Hz',
      disable: false
    },
    {
      name: 'Voltage Harmonics',
      value: 'volhar',
      units: ' %',
      disable: false
    },
    {
      name: 'Power Harmonics',
      value: 'powhar',
      units: ' %',
      disable: false
    },
    {
      name: 'Current Harmonics',
      value: 'currhar',
      units: ' %',
      disable: false
    },
    {
      name: 'Line Voltage',
      value: 'linevol',
      units: ' V',
      disable: false
    },
    {
      name: 'Line Current',
      value: 'linecurr',
      units: ' A',
      disable: false
    },
    {
      name: 'Real Power',
      value: 'realpow',
      units: ' kW',
      disable: false
    },
    {
      name: 'Apparent Power',
      value: 'appow',
      units: ' KVA',
      disable: false
    },
    {
      name: 'Reactive Power',
      value: 'reactpow',
      units: ' KVAR',
      disable: false
    }
  ]

  dyShowTry = false
  dyTryAgain(){
    this.DynamicLoad = true
    this.dyShowTry = false
    this.GetDynamicPowData(this.DynamiSelectedDate)
  }

  ItemDisableinDun(value:string){
    if((value === 'powerfactor' || value === 'kva' || value === 'freq') && this.selectedDetails.length != 0){
      for (let item of this.DynamicChartDropdown) {
        if (item.value === value && (value === 'powerfactor' || value === 'kva' || value === 'freq')) {
            item.disable = false;
        } 
        else {
            item.disable = true;
        }
      }
    }
    else if(value != 'powerfactor' && this.selectedDetails.length != 0){
      for (let item of this.DynamicChartDropdown) {
        if (item.value === 'powerfactor' || item.value === 'kva' || item.value === 'freq') {
            item.disable = true;
        } 
        else {
            item.disable = false;
        }
      }
    }
  }

  OnDynSelect(value:any){
    this.DynamicLoad = true
    // console.log(value, this.selectedDetails)
    // this.ItemDisableinDun(value.itemValue)
    if(value == 'powerfactor'){
      this.selectedDetails = ['powerfactor']
    }
    let Xaxis = this.DynamicChartData.time
    let AppendDetails = []
    for(let i=0; i<this.selectedDetails.length; i++){
      let FindReturn  = this.DynmicChartFind(this.selectedDetails[i])
      AppendDetails.push(FindReturn)
    }
    // console.log(AppendDetails)
    let ChartSeries = [], ThreshVal = 0, TreshText = '', TreshWid = 0
    var header
    let Formatedate = this.datePipe.transform(this.DynamicPowForm.get('date')?.value, 'dd-MM-yyyy')
    for(let i = 0; i < AppendDetails.length; i++){
      if(AppendDetails[i].detailname === 'powerfactor' || AppendDetails[i].detailname === 'freq'){
        let Units = this.DynamicUnitForHeader(AppendDetails[i].detailname)
        let Charttooltip = {valueSuffix: Units?.units}
        header = `${Units?.name} for ${Formatedate}`
        ThreshVal = AppendDetails[i].threshold
        TreshText = `Threshold (${ThreshVal} cosϕ)`
        TreshWid = 2
        ChartSeries.push(
          {
            type: "area",
            name: Units?.name,
            data: AppendDetails[i].data,
            tooltip: Charttooltip
          }
        )
      }
      else if(AppendDetails[i].detailname === 'kva'){
        let len = AppendDetails[i].data
        let AllKVA = AppendDetails[i].allkva
        let PerKVA = AppendDetails[i].allpercent
        ThreshVal = PerKVA
        TreshText = `Threshold: (${ThreshVal} KVA)`
        TreshWid = 2
        let Units = this.DynamicUnitForHeader(AppendDetails[i].detailname)
        let Charttooltip = {valueSuffix: Units?.units}
        let allData = [], miniumper = []
        for(let i=0; i<len.length; i++) {
          allData.push(AllKVA)
        }
        header = `${Units?.name} for ${Formatedate}`
        ChartSeries.push(
          {
            type: "area",
            name: Units?.name,
            data: AppendDetails[i].data,
            tooltip: Charttooltip
          },
          {
            type: "area",
            name: "Allocated Demand",
            data: allData,
            tooltip: Charttooltip
          }
        )
      }
      else{
        header = `${Formatedate}`
        ChartSeries.push(...this.logicforPhases(AppendDetails[i]))
      }
    }
    // console.log("Series", ChartSeries)
    // this.onClickDynmic()
    this.DynamicChartForPower(header, Xaxis, ChartSeries, ThreshVal, TreshWid, TreshText)
  }

  onClickDynmic(){
    this.DynamicLoad = false
  }

  logicforPhases(value: any) {
    let Units = this.DynamicUnitForHeader(value.detailname);
    let Charttooltip = { valueSuffix: Units?.units };
    let phases: Array<{
      type: string,
      name: string,
      data: any,
      tooltip: { valueSuffix: string | undefined },
      animationLimit: number,
    }> = [];
    let phaneName = this.SelectedPhases(Units?.value);
    this.DynamicLoad = true;
  
    // Iterate over each phase and construct the desired object
    if (phaneName == 'linevoltage' || phaneName == 'reactivepower') {
      phases = [{
        type: "area",
        name: `${phaneName}`,
        data: value[phaneName],
        tooltip: Charttooltip,
        animationLimit: 200,
      }];
      
      for (let i = 1; i <= 3; i++) {
        let phaseName = `${phaneName}${i}`;
        phases.push({
          type: "area",
          name: `${phaseName}`,
          data: value[phaseName],
          tooltip: Charttooltip,
          animationLimit: 200,
        });
      }
    }
    else if(phaneName == 'apparentpower' || phaneName == 'THDV' || phaneName == 'THDC' || phaneName == 'THDP'){
      for (let i = 1; i <= 3; i++) {
        let phaseName = `${phaneName}${i}`;
        phases.push({
          type: "area",
          name: ` ${phaseName}`,
          data: value[phaseName],
          tooltip: Charttooltip,
          animationLimit: 200,
        });
      }
    }
    else{
      if(phaneName=='linecurrent'){
        phases = [{
          type: "area",
          name: `avgcurrent`,
          data: value['avgcurrent'],
          tooltip: Charttooltip,
          animationLimit: 200,
        }];
        
        for (let i = 1; i <= 3; i++) {
          let phaseName = `${phaneName}${i}`;
          phases.push({
            type: "area",
            name: `${phaseName}`,
            data: value[phaseName],
            tooltip: Charttooltip,
            animationLimit: 200,
          });
        }
      }
      else if(phaneName=='realpower'){
        phases = [{
          type: "area",
          name: `actualpower`,
          data: value['actualpower'],
          tooltip: Charttooltip,
          animationLimit: 200,
        }];
        
        for (let i = 1; i <= 3; i++) {
          let phaseName = `${phaneName}${i}`;
          phases.push({
            type: "area",
            name: `${phaseName}`,
            data: value[phaseName],
            tooltip: Charttooltip,
            animationLimit: 200,
          });
        }
      }
    }
  
    this.DynamicLoad = true;
    return phases;
  }
  

  SelectedPhases(value:any){
    switch(value){
      case "linevol": return 'linevoltage' 
        break;
      case "reactpow": return 'reactivepower' 
        break;
      case "appow": return 'apparentpower' 
        break;
      case "volhar": return 'THDV' 
        break;
      case "currhar": return 'THDC' 
        break;
      case "powhar": return 'THDP' 
        break;
      case "linecurr": return 'linecurrent' 
        break;
      case "realpow": return 'realpower' 
        break;
      default: return ''
    }
  }


  onDynRemove(value:any){
    this.selectedDetails = []
    for (let item of this.DynamicChartDropdown) {
      item.disable = false;
    }
  }

  DynmicChartFind(value:string){
    let DynChartdata = this.DynamicChartData.details
    let Findvalue = DynChartdata.find((item:any)=>{
      return item.detailname === value
    })
    return Findvalue
  }


  DynamicUnitForHeader(value:string){
    let FindHeader = this.DynamicChartDropdown.find((e)=>{
      return e.value === value
    })
    return FindHeader
  }

  DynamicLoad = false
  DynamicChartData:any
  DynamiSelectedDate:any
  dynLoadVis = false

  GetDynamicPowData(value: any){
    this.dynLoadVis = true
    this.DynamicLoad = true
    this.dyShowTry = false
    this.DynamiSelectedDate = value
    var date = this.datePipe.transform(value, 'yyyy-MM-dd');
    var formateDate = this.datePipe.transform(value, 'dd-MM-yyyy');
    this.ChartApi.PowerDetailData('powerdetails', date).subscribe(
      res =>{
        if(res == "No data available"){
          this.DynamicLoad = false
          this.dyShowTry = true
          this.message = res + " for selected date"
          this.DynamicChartData = null
        }
        this.selectedDetails = []
        for (let item of this.DynamicChartDropdown) {
          if(item.value == 'powerfactor'){
            item.disable = false;
          }
          else{
            item.disable = false;
          }
            
        }
        this.DynamicChartData = res
        this.OnDynSelect('powerfactor')
        this.dynLoadVis = false
        this.onClickDynmic()
      },
      error=>{
        // console.log(error)
        if(error.status == 0){
          this.DynamicChartData = null
          this.DynamicLoad = false
          this.dyShowTry = true
          this.message = error.statusText
        }
        else if(error.status == 404){
          this.message = error.statusText
          this.DynamicChartData = null
          this.DynamicLoad = false
          this.dyShowTry = true
        }
        else if(error.status == 500){
          this.message = "Oops ! , Incomer HT Meter data cannot be fetched."
          this.DynamicChartData = null
          this.DynamicLoad = false
          this.dyShowTry = true
        }
        else{
          this.message = error.error
        }
      }
    )
  }
  

  DynamicChartForPower(TextValue:any, Xcata:any, SeriesData:any, threshVal:number, threshWidth:number, threstext: string){
    const color0 = Highcharts.getOptions()?.colors?.[0] || 'defaultColor';
    const rgba = Highcharts.color(color0).setOpacity(0).get('rgba') || 'defaultRGBA';

    this.DynamicChartOptions = {
      chart: {
        type: 'area',
        zoomType: 'x',
     },
     exporting: {
      buttons: {
          contextButton: {
              symbol: 'url(../../assets/download.png)'
          }
        },
        filename:'Powerfactor '
     },
      accessibility: {
          description: '',
      },
      time: {
        useUTC: true
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
        categories: Xcata,
        tickInterval: 67,
        labels:{
          style:{
            fontSize:10,
          }
        }
      },
      yAxis: {
        plotLines: [{
          color: 'red',
          width: threshWidth,
          value: threshVal,
          zIndex: 3,
          label: {
              text: threstext,
              align: 'right',
              style: {
                color: 'red',
                fontWeight: 'bold'
              }
          }
        }
      ],
        title: {
            text: ''
        }
    },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
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
            enabled: false,
            states: {
             hover: {
              enabled: true
            }
           }
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
        style:{
          color:"#333333",
          fontSize:"11px"
        }
      },
      series: SeriesData

    }
  }


  EnergyToday!: number
  NetExportEng!: number
  EnergyYesterday!: number
  EnergyThisWeek!: number
  EnergyThisMonth!: number

  PowerFac!: number
  PowerFactorMax!: number
  PowerFactorMin!: number

  Demands!: number
  MaxDemand!: number
  MinDemand!: number

  Frequency!: number

  Voltage!: number
  Voltage1!: number
  Voltage2!: number
  Voltage3!: number

  Current!: number
  Current1!: number
  Current2!: number
  Current3!: number
  
  RealPow!: number
  RealPower1!: number
  RealPower2!: number
  RealPower3!: number

  ReactPow!: number
  ReactivePow1!: number
  ReactivePow2!: number
  ReactivePow3!: number

  AppPow!: number
  ApprantPow1!: number
  ApprantPow2!: number
  ApprantPow3!: number

  VolHarV1!: number
  VolHarV2!: number
  VolHarV3!: number

  CurHarC1!: number
  CurHarC2!: number
  CurHarC3!: number

  

  UpdateCardsDetails(Data:any) {

    this.NetExportEng = Number(Data.NetExportEng) || 0;
    this.EnergyToday = Number(Data.plantec) || 0;
    this.EnergyYesterday = Number(Data.yesterEnergy) || 0;
    this.EnergyThisWeek = Number(Data.weekEnergy) || 0;
    this.EnergyThisMonth = Number(Data.monthEnergy) || 0;

    this.Frequency = Number(Data.avg_freq) || 0;

    this.Demands = Number(Data.totDemands) || 0;
    this.MaxDemand = Number(Data.maxdemands) || 0;
    this.MinDemand = Number(Data.mindemands) || 0;

    this.PowerFac = Number(Data.avgpwrfctr) || 0; 
    this.PowerFactorMax = Number(Data.maxpwrfctr) || 0;
    this.PowerFactorMin = Number(Data.minpwrfctr) || 0;

    this.Voltage = Number(Data.totVol) || 0;
    this.Voltage1 = Number(Data.vol1) || 0;
    this.Voltage2 = Number(Data.vol2) || 0;
    this.Voltage3 = Number(Data.vol3) || 0;

    this.Current = Number(Data.totCur) || 0;
    this.Current1 = Number(Data.cur1) || 0;
    this.Current2 = Number(Data.cur2) || 0;
    this.Current3 = Number(Data.cur3) || 0;

    this.RealPow = Number(Data.totRelpwr) || 0;
    this.RealPower1 = Number(Data.Relpwr1) || 0;
    this.RealPower2 = Number(Data.Relpwr2) || 0;
    this.RealPower3 = Number(Data.Relpwr3) || 0;
    this.ReactPow = Number(Data.TRecpwr) || 0;

    this.ReactivePow1 = Number(Data.Recpwr1) || 0;
    this.ReactivePow2 = Number(Data.Recpwr2) || 0;
    this.ReactivePow3 = Number(Data.Recpwr3) || 0;

    this.AppPow = Number(Data.totAppPwr) || 0;
    this.ApprantPow1 = Number(Data.AppPwr1) || 0;
    this.ApprantPow2 = Number(Data.AppPwr2) || 0;
    this.ApprantPow3 = Number(Data.AppPwr3) || 0;

    this.VolHarV1 = Number(Data.VolHar1) || 0;
    this.VolHarV2 = Number(Data.VolHar2) || 0;
    this.VolHarV3 = Number(Data.VolHar3) || 0;

    this.CurHarC1 = Number(Data.CurHar1) || 0;
    this.CurHarC2 = Number(Data.CurHar2)|| 0;
    this.CurHarC3 = Number(Data.CurHar3) || 0;
  }

  isPowerFacLessThanOne(): boolean {
    return this.PowerFac < 0.90;
  }

  selectedNodes!: TreeNode[];
  flowload = false
  MonthName:any
  updateorgDataArray(date:any) {
    this.flowload = true
    var Month = this.datePipe.transform(date, 'M/yyyy');
    var MonthNam = this.datePipe.transform(date, 'MMMM YYYY');
    this.MonthName = MonthNam?.toString();
    var [month, Year] = Month?.split('/') ?? [];
    let payload = {
      month:month,
      year: Year
    }
    this.ChartApi.Postdata('energychart', payload).subscribe(
      res => {
        this.energyData = res
        this.Dgcon = this.energyData.DG;
        this.DgCost = this.energyData.DGCost
        this.SolarCon = this.energyData["Solar Energy"];
        this.SolarCost = this.energyData.SolarCost
        this.WindCon = this.energyData.Wind
        this.WindCost = this.energyData.WindCost
        this.EBCon = this.energyData.Transformer1
        this.EBCost = this.energyData.EBCost

        this.data = [
          {
              label: 'Energy Source',
              expanded: true,
              children: [
                  {
                      label: 'Direct-Captive',
                      expanded: true,
                      children: [
                          {
                            label: 'Renewable',
                            expanded: true,
                            children: [{
                              type: 'person',
                              data: {
                                name: 'Solar',
                                title1: Number(this.SolarCon).toLocaleString() + ' kWh',
                                title2: Number(this.SolarCost).toLocaleString()
                              },
                            }]
    
                          },
                          {
                              label: 'Non Renewable',
                              expanded: true,
                              children: [{
                                type: 'person',
                                data: {
                                  name: 'DG',
                                  title1: Number(this.Dgcon).toLocaleString() + ' l',
                                  title2: Number(this.DgCost).toLocaleString()
                                },
                              }]
                          }
                      ]
                  },
                  {
                      label: 'Indirect',
                      expanded: true,
                      children: [
                          {
                              label: 'Renewable',
                              expanded:true,
                              children: [{
                                type: 'person',
                                data: {
                                  name: 'WindMill',
                                  title1: Number(this.WindCon).toLocaleString() + ' kWh',
                                  title2: Number(this.WindCost).toLocaleString()
                                },
                              }]
                          },
                          {
                              label: 'Non Renewable',
                              expanded:true,
                              children: [
                              {
                                type: 'person',
                                data: {
                                  name: 'Electricity Board',
                                  title1: Number(this.EBCon).toLocaleString() + ' kWh',
                                  title2: Number(this.EBCost).toLocaleString()
                                },
                              },
                              {
                                type: 'person',
                                data: {
                                  name: 'Third Party',
                                  title1: Number(this.ThirdCon).toLocaleString() + ' kWh',
                                  title2: Number(this.ThirdCost).toLocaleString()
                                },
                              },
                              {
                                type: 'person',
                                data: {
                                  name: 'Power Trading',
                                  title1: Number(this.PowTCon).toLocaleString() + ' kWh',
                                  title2: Number(this.PowTCost).toLocaleString()
                                },
                              }
                            ]
                          }
                      ]
                  }
              ]
          }
        ];
        this.flowload = false
      }
    )
  }


}