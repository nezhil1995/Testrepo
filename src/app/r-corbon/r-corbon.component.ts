import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RCorbonService } from './r-corbon.service';
import { faCircleInfo, faDumpster, faFileExcel, faGasPump, faPlugCircleBolt, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Rcarbon } from './Data'
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
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
  ApexMarkers,
  ApexTooltip,
} from "ng-apexcharts";
import * as Highcharts from 'highcharts';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  markers: ApexMarkers;
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-r-corbon',
  templateUrl: './r-corbon.component.html',
  styleUrls: ['./r-corbon.component.css'],
  providers: [DatePipe]
})
export class RCorbonComponent implements OnInit{

  ico1 = faSeedling 
  elcBolt = faPlugCircleBolt
  gas = faGasPump
  dump = faDumpster
  info = faCircleInfo

  file = faFileExcel


  CarbonData: Rcarbon[] = []
  tableData!:any

  Dashload = true
  loading = true

  carbonDashData:any

  maxDate = new Date();
  DefaultDate = new Date();
  form:FormGroup

  disabledMonths?: any[];
  displayModal = false
  DiaHeader = ''

  sourceNames: any[] = []

  endpoint = 'rcarbon'

  Scope1 = [
    "Diesel", "Petrol", "LPG", "CNG", "PNG", "Air conditioning", "Fresh Water", "Water Charging (Rain Water Harvesting)",
    "Process Chillers / HVAC"
  ]

  Scope2 = [
    "Purchased electricity from Electricity Authorities (non renewable)", 
    "Purchased electricity from Third Party (Nuclear - Non-Renewable)",
    "Purchased electricity from Third Party (CNG - Non-Renewable)",
    "Purchased electricity from Second Party (Solar - Renewable)",
    "Purchased electricity from Third Party (Wind - Renewable)",
    "Water Consumption from Out-source"
  ]

  Scope3 = [
    "Waste"
  ]

  scopeData: any[] = []

  ngOnInit(): void {
    this.form.controls['type'].setValue(this.DefaultSelect)
    this.GetCarbonEmmdata(this.DefaultDate)
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });
    window.scroll(0,0);
    this.GetData();
    this.chartOp()
  }

  energy_con = 0
  fuel_con = 0
  waste = 0

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      res=>{
        this.carbonDashData = res
        this.energy_con = this.carbonDashData.Energy_Emission
        this.fuel_con = this.carbonDashData.Fuel_Emission
        this.waste = this.carbonDashData.Waste
        this.sourceNames = this.carbonDashData.Emission_name
        this.circlrChartUpdate()
        this.AreaChartUpdate()
        this.Dashload = false
      }
    )
  }

  InfoClick(scope:string){
    console.log("working")
    this.displayModal = true
    this.DiaHeader = scope
    if(scope === 'Scope 1'){
      this.scopeData = this.Scope1
    }
    else if(scope === 'Scope 2'){
      this.scopeData = this.Scope2
    }
    else if(scope === 'Scope 3'){
      this.scopeData = this.Scope3
    }
    
  }

  donutchartData : any[] = []
  piechartData : any[] = []

  circlrChartUpdate(){
    let scopeDatalen = this.carbonDashData.Scope_data
    let scopeNamelen = this.carbonDashData.Scope_name
    for(let i=0; i<scopeDatalen.length; i++){
      let DataRan = {
        name: scopeNamelen[i],
        y: scopeDatalen[i]
      }
      this.donutchartData.push(DataRan)
    }

    let EmiData = this.carbonDashData.Emission_data
    let EmiName = this.carbonDashData.Emission_name
    for(let i=0; i< EmiData.length; i++){
      let DataRan = {
        name: EmiName[i],
        y: EmiData[i]
      }
      this.piechartData.push(DataRan)
    }
  }

  AreaChartUpdate(){
    let S1Data = this.carbonDashData.Monthly_emission_S1
    let S2Data = this.carbonDashData.Monthly_emission_S2
    let S3Data = this.carbonDashData.Monthly_emission_S3
    let monthlyName = this.carbonDashData.Monthly_emission_name

    let chartSeries = [
      {
        name: 'Scope 1',
        data: S1Data
      },
      {
        name: 'Scope 2',
        data: S2Data
      },
      {
        name: 'Scope 3',
        data: S3Data
      }
    ]

    this.areachartTrans.series = chartSeries
    this.areachartTrans.xaxis.categories = monthlyName
  }

  @ViewChild("chart") chart!: ChartComponent;
  public donut: Partial<ChartOptions> | any;
  public piechart: Partial<ChartOptions> | any;
  public areachartTrans: Partial<ChartOptions> | any;

  
  Highcharts = Highcharts;
  chart1!: Highcharts.Chart;
  donchartOptions!:any
  piechartOptions!:any
  linechartOptions!:any


  chartOp(){

    const colors = Highcharts.getOptions().colors?.map((c, i) =>
      Highcharts.color('#7DCE13').brighten((i - 4) / 7).get()
    );

    this.donchartOptions = {
      
      chart: {
        type: 'pie'
      },

      exporting: {
        buttons: {
            contextButton: {
                symbol: 'url(../../assets/download.png)'
            }
          },
          filename:'Emission by Scope'
       },

      title: {
        text: undefined
      },

      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {point.name}</b><br/>' + 'Emission: <b>{point.y:,.1f}</b> Kg CO₂ e'
      },

      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors,
            dataLabels: {
              enabled: true,
              format: '{point.name}'   
            }
        }
      },

      series: [{
        minPointSize: 30,
        innerSize: '50%',
        colorByPoint: true,
        zMin: 0,
        data: this.donutchartData
      }]
    };

    this.piechartOptions = {
      chart: {
        type: 'pie'
      },
      exporting: {
        buttons: {
            contextButton: {
                symbol: 'url(../../assets/download.png)'
            }
          },
          filename:'Emission by Source'
       },
      title: {
        text: undefined
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {point.name}</b><br/>' + 'Emission: <b>{point.y:,.1f}</b> Kg CO₂ e'
      },
      colors: ['#3EC70B'],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors,
          showInLegend: false,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>'
          }
        }
      },
      series: [{
        colorByPoint: true,
        minPointSize: 30,
        innerSize: '0%',
        zMin: 0,
        data: this.piechartData
      }]
    }
  }

  DefaultSelect = 'date basis'

  seleter = [
    {
      name: 'Date Basis',
      value: 'date basis'
    },
    {
      name: 'Month Basis',
      value: 'month basis'
    },
    {
      name: 'Year Basis',
      value: 'year basis'
    }
  ]

  constructor( private datePipe: DatePipe, private ApiData: RCorbonService, private Cookie: CookieService, private datepipe: DatePipe)
  {

    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      month: new FormControl(''),
      year: new FormControl('')
    })
 
    this.areachartTrans = {
      series: [],
      chart: {
        type: "area",
        height: '100%',
        stacked: true,
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
              filename: `Monthly Emission by Scope`,
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

      theme: {
        monochrome: {
          enabled: true,
          color: '#6ECB63',
          shadeTo: 'light',
          shadeIntensity: 0.25
        },
      },

      markers: {
        size: 4,
      },

      xaxis: {
        categories: [],
        floating:false,
        labels: {
          show: true,
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
        horizontalAlign: "center",
        position: "top"
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + ' Kg CO₂ e'
          }
        }
      }
    };

  }

  OntypeChanges(){
    this.GetCarbonEmmdata(this.DefaultDate)
  }

  getMaxDate(): Date {
    return new Date();
  }

  srcload = false
  CarSrcdata:any

  GetCarbonEmmdata(date:any){
    this.srcload = true;
    let Formatedate = this.datepipe.transform(date, 'yyyy-MM-dd');
    let Month = this.datepipe.transform(date, 'MM');
    let Year = this.datepipe.transform(date, 'yyyy')
    let payload = {
      type: this.form.controls['type']?.value,
      date: Formatedate,
      month: Month,
      year: Year
    }
    this.ApiData.PostData('carbonsrc', payload).subscribe(
      res=>{
        this.CarSrcdata = res
        this.SrccarbonChart('', this.CarSrcdata.label, this.CarSrcdata.carbon)
        this.srcload = false;
      }
    )
  }


  SrccarbonChart(TextValue:string, Xcata:any, Series:any){

    const colors = Highcharts.getOptions().colors?.map((c, i) =>
      Highcharts.color('#7DCE13').brighten((i - 4) / 7).get()
    );

    this.linechartOptions = {
      chart: {
        type: 'line',
     },
     exporting: {
      buttons: {
          contextButton: {
              symbol: 'url(../../assets/download.png)'
          }
        },
        filename:'Source wise Carbon emission '
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
      xAxis: {
        categories: Xcata,
        labels:{
          style:{
            fontSize:10,
          }
        }
      },
      legend: {
        enabled: true
      },
      plotOptions:{
        line:{
          color:"#416D19",
        }
      },
      series: Series,
      tooltip: {
        shared: false,
        crosshairs: true,
        split: true, 
        valueSuffix: 'kg CO₂ e'
      },
    }


  }




}
