import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { ClusterAlalyticsServiceService } from '../cluster-service.service';
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
  selector: 'app-sourcedata',
  templateUrl: './sourcedata.component.html',
  styleUrls: ['./sourcedata.component.css'],
  providers:[DatePipe]
})
export class SourcedataComponent implements OnInit {

  @Input() plants:any

  form: FormGroup;
  load = true

  monthmaxDate = new Date();
  yearmaxdate = new Date()

  dafualtDate = new Date()
  defaultType = 'Month Basis'
  DefaultSource = ''

  SourceData:any

  ngOnInit(): void {
    this.getScrdata()
  }

  getScrdata(){
    let Data = {
      plants: this.plants
    }
    this.ApiData.GetClusterSrc('clustersource', Data).subscribe(
      res=>{
        this.SourceData = res.src
        this.DefaultSource = this.SourceData[0]
        this.form.get('source')?.setValue(this.DefaultSource)
        this.form.get('type')?.setValue(this.defaultType)
        this.GetChartData(this.dafualtDate, 'month')
        this.load = false
      }
    )
  }

  @ViewChild("chart") chart!: ChartComponent;
  public CostMixedChart: Partial<ChartOptions> | any

  constructor(private ApiData: ClusterAlalyticsServiceService, private datepipe: DatePipe) { 
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      source: new FormControl('', Validators.required),
      commondate: new FormControl('', Validators.required),
    })

  }

  ChartData:any
  SourceChartLoop: any[] = []
  chartLoad = false
  Chartitle = ''
  SelectedDate:any
  SelectedType:any

  GetChartData(val:any, type:string){
    this.chartLoad = true
    this.SelectedDate = val
    this.SelectedType = type
    let month = this.datepipe.transform(val, 'MM')
    let year = this.datepipe.transform(val, 'yyyy')
    var MonthNam = this.datepipe.transform(val, 'MMMM YYYY');
    let formData, basestring, FromStr
    if(type === 'month'){
      formData = {
        type: this.form.get('type')?.value,
        source: this.form.get('source')?.value,
        Month: month,
        Year: year,
        plants: this.plants
      }
      basestring = 'MONTH'
      FromStr = MonthNam?.toLocaleUpperCase()
    }
    else{
      formData = {
        type: this.form.get('type')?.value,
        source: this.form.get('source')?.value,
        Month: null,
        Year: year,
        plants: this.plants
      }
      basestring = 'YEAR'
      FromStr = year
    }
    this.Chartitle = `${this.form.get('source')?.value.toUpperCase()} CONSUMPTION AND COST DATA FOR ${basestring} ${FromStr}`
    // console.log(formData)
    this.ApiData.Postdata('clustersource', formData).subscribe(
      res=>{
        this.ChartData = res
        this.SourceChartLoop = []
        let series
        
        for(let i=0; i<this.ChartData.length; i++){
          series = [
            {
              name: "Consumption",
              type: "column",
              data: this.ChartData[i].energycon
            },
            {
              name: "Cost",
              type: "line",
              data: this.ChartData[i].costcon
            }
          ]
          this.SourceChartLoop.push(this.ChartOptionsData(series, this.ChartData[i].label, this.ChartData[i].plantname))
        }
        // console.log(this.SourceChartLoop[0])
        this.chartLoad = false
      }
    )
  }

  getChartOptionsData(num:number){
    return this.SourceChartLoop[num]
  }

  OnchangeSrc(){
    if(this.form.valid){
      this.GetChartData(this.SelectedDate, this.SelectedType)
    }
  }

  ChartOptionsData(Series:any, xcategories:any, plant:string){
    return this.CostMixedChart = {
      series: Series,

      chart: {
        type: "area",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        stacked: true,
        zoom: {
          enabled: false
        }
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
        categories: xcategories,
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
        title: {
          text: plant,
          style: {
            color: '#0B60B0',
            fontSize: '15px',
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 600,
          },
        },
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
              return formattedValue + this.UnitsforCostChart(this.form.get('source')?.value)
            }
            else{
              return '₹ ' + formattedValue
            }
          },
        }
      }
    };
  }

  UnitsforCostChart(name: string): string {
    if(name==='Transformer1' || name==='Wind' || name==='Solar Energy'){
      return ' kWh';
    }
    else if(name==='PNG' || name==='CNG' || name==='LPG'){
      return ' Kg';
    }
    else if(name==='DG' || name==='Petrol' || name==='Water'){
      return ' L';
    }
    else{
      return ''
    }
  }


}
