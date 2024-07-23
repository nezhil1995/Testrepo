import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { ClusterAlalyticsServiceService } from './cluster-service.service';
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
  selector: 'app-cluster-analytics',
  templateUrl: './cluster-analytics.component.html',
  styleUrls: ['./cluster-analytics.component.css'],
  providers:[DatePipe]
})
export class ClusterAnalyticsComponent implements OnInit {

  load = true

  pfform : FormGroup
  kvaform : FormGroup
  peakOffpeakform : FormGroup
  maxDate = new Date();
  kvamaxdate = new Date()
  KvaDefaultDate = new Date();
  pfDefaultDate = new Date();

  defaultType = "Date basis"
  plants: any[] = []
  kvainputDate:any
  pfinputDate:any

  @ViewChild("chart") chart!: ChartComponent;
  public secChartOptions:any
  public KvaChartOptions:any
  public pfChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;

  constructor(private ApiData:ClusterAlalyticsServiceService, private datePipe: DatePipe){
    
    this.pfform = new FormGroup({
      date: new FormControl('', Validators.required)
    })

    this.kvaform = new FormGroup({
      date: new FormControl('', Validators.required),
    })

    this.peakOffpeakform = new FormGroup({
      type: new FormControl('', Validators.required),
      month: new FormControl(''),
      date: new FormControl('')
    })

  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.getClusterPlants()
  }

  getClusterPlants(){
    this.ApiData.getClusterPlants('getclusterplants').subscribe(
      res =>{
        this.plants = res.map((item:any) => item.amaplantname)
        this.load = false
        this.GetMonthKVAData(this.kvamaxdate)
        this.GetDatePFData(this.pfDefaultDate)
      }
    )
  }

  
  kvaLoopdata: any[] = []

  kvaload = false
  kvadata:any
  GetMonthKVAData(val:any){
    this.kvaload = true
    let formData
    const date =  this.datePipe.transform(val, 'yyyy-MM-dd')
    this.kvainputDate = this.datePipe.transform(val, 'dd-MM-yyyy')
    formData = {
      plants: this.plants
    }
    this.ApiData.getClusterPF('clusterkva',date, formData).subscribe(
      res=>{
       this.kvadata = res
       this.kvaLoopdata = []
       let series, Catagories, text, allDemandseries
       for(let i=0; i<this.kvadata.length ;i++){
        series = this.formateForChart(this.kvadata[i].kva)
        Catagories = this.FormateForxAxix(this.kvadata[i].kva);
        text = `${this.kvadata[i].Plantname}`
        allDemandseries = []
        for(let ind=0; ind<series.length; ind++){
          allDemandseries.push(this.kvadata[i].allkva)
        }
        this.kvaLoopdata.push(this.KVAChartOptionsd(Catagories,series,allDemandseries,text))
       }
       this.kvaload = false
      }
    )
  }

  PFLoopdata: any[] = []

  pfload = false
  pfdata:any

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

  GetDatePFData(val:any){
    this.pfload = true
    const date =  this.datePipe.transform(val, 'yyyy-MM-dd')
    this.pfinputDate = this.datePipe.transform(val, 'dd-MM-yyyy')
    let formdata = {
      plants: this.plants
    }
    this.ApiData.getClusterPF('clusterpf', date, formdata).subscribe(
      res => {
        this.pfdata = res
        this.PFLoopdata = []
        let length = this.pfdata.length
        let series, Catagories, text
        for(let i = 0; i < length; i++) {
          series = this.formateForChart(this.pfdata[i].Pf)
          Catagories = this.FormateForxAxix(this.pfdata[i].Pf);
          text = `${this.pfdata[i].Plantname}`
          this.PFLoopdata.push(this.PfChartOptionsUpdate(text, Catagories, series))
        }
        this.pfload = false
      }
    )
  }

  getChartOptions(num: number){
    return this.kvaLoopdata[num]
  }

  getPFChartLoop(num: number){
    return this.PFLoopdata[num]
  }

  KVAChartOptionsd(x:any, y:any, y2:any, TextValue:string){
    const color0 = Highcharts.getOptions()?.colors?.[0] || 'defaultColor';
    const rgba = Highcharts.color(color0).setOpacity(0).get('rgba') || 'defaultRGBA';
    this.KvaChartOptions={
      chart: {
        type: 'area',
        zoomType: 'x',
      },
      accessibility: {
          description: '',
      },
      title: {
          text: '',
          style:{
            fontSize: 14,
          }
      },
      subtitle: {
        text: 'Drag in the plot area to zoom in',
          style:{
            fontSize: 11,
            color: '#da2020'
          }
      },
      xAxis: {
        categories: x,
        tickInterval: 65,
        labels:{
          style:{
            fontSize:10,
          }
        }
      },
      yAxis: {
        title: {
          text: TextValue,
          style:{
            color:"#0B60B0",
            fontSize:"15px"
          }
        }
      },
      legend: {
        enabled: true,
        verticalAlign: "top",
        itemStyle:{
          fontSize: 11
        }
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
        shared: false,
        crosshairs: true,
        split: true,
        headerFormat: '<span style="font-size:12px"><b>{point.key}&nbsp;</b></span><br>'
      },
      series: [
        {
          type: 'area',
          name: "UTILIZED KVA",
          data: y
        },
        {
          type: 'area',
          name: "ALLOCATED DEMAND",
          data: y2
        },
      ]
    }
    return this.KvaChartOptions
  }

  PfChartOptionsUpdate(TextValue:string, Xcata:any, DataSeries:any){
    const color0 = Highcharts.getOptions()?.colors?.[0] || 'defaultColor';
    const rgba = Highcharts.color(color0).setOpacity(0).get('rgba') || 'defaultRGBA';

    return this.pfChartOptions = {
      chart: {
        type: 'area',
        zoomType: 'x',
     },
     colors:["#3468C0"],
      accessibility: {
          description: '',
      },
      time: {
        useUTC: true
      },
      title: {
          text: '',
          style:{
            fontSize: 15,
          }
      },
      subtitle: {
          text: 'Drag in the plot area to zoom in',
          style:{
            fontSize: 11,
            color: '#da2020'
          }
      },
      xAxis: {
        categories: Xcata,
        tickInterval: 65,
        ordinal: false,
        labels:{
          style:{
            fontSize:10,
          }
        }
      },
      yAxis: {
        title: {
          text: TextValue,
          style:{
            color:"#0B60B0",
            fontSize:"15px"
          }
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
        headerFormat: '<span style="font-size:12px"><b>{point.key:%H:%M:%S}&nbsp;</b></span><br>'
      },
      series: [{
        type: 'area',
        name: "POWER FACTOR",
        data: DataSeries
      }]
    }
  }

  
}
