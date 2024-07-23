import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { SuperclusterServiceService } from '../supercluster-service.service';
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
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
  tooltip: ApexTooltip
  stroke: ApexStroke
};


@Component({
  selector: 'app-chartview',
  templateUrl: './chartview.component.html',
  styleUrls: ['./chartview.component.css'],
  providers:[DatePipe]
})
export class ChartviewComponent implements OnInit { 

  form:FormGroup
  formPlantYear:FormGroup
  CompPlantYear:FormGroup
  plantsCostMon:FormGroup
  secForm:FormGroup
  plant:any
  DefaultDate = new Date();
  maxDate = new Date();

  secData:any

  SecLoad = false
  plantLoad = true

  defalutPlantValue = 'MATE U-I, MATE U-II'

  ngOnInit(): void {
    this.GetClusterPlants()
  }

  GetClusterPlants(){
    this.ApiData.GetClusterPlants('getplants').subscribe(
      res => {
        this.plant = res
        this.plantLoad = false
      }
    )
  }

  public secChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;

  @ViewChild("chart") chart!: ChartComponent;
  public PlantYearchartOptions: Partial<ChartOptions> | any;
  public CompPlantchartOptions: Partial<ChartOptions> | any;
  public plantCostareaOptions: Partial<ChartOptions> | any;

  constructor(private datePipe: DatePipe, private ApiData: SuperclusterServiceService) {
    this.form = new FormGroup({
      plantname: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required)
    })

    this.formPlantYear = new FormGroup({
      plantname: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required)
    })

    this.CompPlantYear = new FormGroup({
      plantname: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required)
    })

    this.plantsCostMon = new FormGroup({
      selectMonth: new FormControl('', Validators.required)
    })

    this.secForm = new FormGroup({
      plantname: new FormControl(''),
      year: new FormControl('', Validators.required)
    })

    this.PlantYearchartOptions = {
      series: [
        {
          name: 'Cost',
          data: []
        },
      ],
      chart: {
        height: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "55%",
          distributed: true,
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
          fontSize: "10.5px",
        },
        offsetY:-17
      },
      legend: {
        show: false
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "10.5px",
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

    this.CompPlantchartOptions = {
      series: [
        {
          name: 'Cost',
          data: []
        },
      ],
      chart: {
        height: '100%',
        type: "line",
        fontFamily: 'SharpSans, sans-serif',
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "55%",
          distributed: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position:'top'
      },
      grid: {
        show: true,
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "10.5px",
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

    this.plantCostareaOptions = {
      series: [
        {
          name: 'Cost',
          data: []
        },
      ],
      chart: {
        height: '100%',
        type: "area",
        fontFamily: 'SharpSans, sans-serif',
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "55%",
          distributed: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position:'top'
      },
      grid: {
        show: true,
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "10.5px",
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

  secEndpoint = 'secsupercluster'
  seriesData:any

  GetYearSECData(val:any){
    if(val){
      this.SecLoad = true
      const year = this.datePipe.transform(this.form.get('year')?.value, 'yyyy');
      let FormData = {
        year: year,
        plantname: this.form.get('plantname')?.value
      }
      this.seriesData = []
      let text = 'SEC DATA FOR '+this.form.get('plantname')?.value+' IN YEAR '+ year
      this.ApiData.SECPostData(this.secEndpoint, FormData).subscribe(
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

  plantYearLoad = false
  plantYearCostData:any

  GetPlantYearCost(val:any){
    this.plantYearLoad = true
    const year = this.datePipe.transform(this.formPlantYear.get('year')?.value, 'yyyy');
    let plantnames = this.formPlantYear.get('plantname')?.value
    let FormData = {
      year: year,
      plantname: plantnames
    }
    this.ApiData.postData('plantyearcost', FormData).subscribe(
      res=>{
        this.plantYearCostData = res
        console.log(this.plantYearCostData)
        let series = [
          {
            name:'Cost',
            data: this.plantYearCostData.value
          }
        ]
        this.PlantYearchartOptions.series = series
        this.PlantYearchartOptions.xaxis.categories = this.plantYearCostData.month
        this.PlantYearchartOptions.title = { text: `COST DETAILS FOR ${this.formPlantYear.get('plantname')?.value} ${year}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}},
        this.plantYearLoad = false
      }
    )
  }

  CompplantYearLoad = false
  CompplantYearCostData:any

  GeComptPlantYearCost(val:any){
    this.CompplantYearLoad = true
    const year = this.datePipe.transform(this.CompPlantYear.get('year')?.value, 'yyyy');
    let plantNames = this.CompPlantYear.get('plantname')?.value
    let FormData = {
      year: year,
      plantname: plantNames
    }
    console.log(plantNames,FormData)
    this.ApiData.postData('compplantcost', FormData).subscribe(
      res=>{
        this.CompplantYearCostData = res
        this.CompPlantchartOptions.series = this.CompplantYearCostData.plantscostdata
        this.CompPlantchartOptions.xaxis.categories = this.CompplantYearCostData.month
        this.CompPlantchartOptions.title = { text: `COST DETAILS IN ${year}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}},
        this.CompplantYearLoad = false
      }
    )
  }

  plantsCostLoad = false
  plantsCostData:any
  GetPlantsCostData(value:any){
    this.plantsCostLoad = true
    var Month = this.datePipe.transform(value, 'M/yyyy');
    var MonthNam = this.datePipe.transform(value, 'MMMM YYYY');
    var [month, Year] = Month?.split('/') ?? [];
    let Data ={
      month: month,
      year: Year
    }
    this.ApiData.postData('multiplantscost', Data).subscribe(
      res=>{
        this.plantsCostData = res
        let ChartSerire = [
          { 
            name:'Cost',
            data: this.plantsCostData.costdata
          }
        ]
        this.plantCostareaOptions.series = ChartSerire
        this.plantCostareaOptions.xaxis.categories = this.plantsCostData.plantnames
        this.plantCostareaOptions.title = { text: `COST DETAILS FOR ${MonthNam?.toUpperCase()}`, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}},
        this.plantsCostLoad = false
      }
    )
  }

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
      shared: true,
      headerFormat: '<span style="font-size:12px"><b>{point.key:%d-%m-%Y}&nbsp;(SEC)</b></span><br>'
    },
    series: this.seriesData

    }
  }


}
