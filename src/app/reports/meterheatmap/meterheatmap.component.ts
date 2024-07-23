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

import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-meterheatmap',
  templateUrl: './meterheatmap.component.html',
  styleUrls: ['./meterheatmap.component.css'],
  providers:[DatePipe]
})
export class MeterheatmapComponent implements OnInit {

  form!:FormGroup;
  date:any
  HeatmapData : any

  chartLoad:boolean = false

  formatDate(dateValue: any) {
    const date = this.datepipe.transform(dateValue, 'dd-MM-yyyy');
    return date
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private ApiData: ReportsService, private datepipe: DatePipe,){
    this.form = new FormGroup({
      Date: new FormControl('', Validators.required)
    })

    this.chartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "heatmap",
        fontFamily: 'SharpSans, sans-serif',
      },
      plotOptions: {
        heatmap: {
          radius: 0.5,
          enableShades: true,
          distributed: true,
          // shadeIntensity: 0.5,
          inverse: false,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: []
          },
        }
      },
      states: {
        hover: {
         filter: {
            type: 'none'
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'top',
        align:'center'
      },
      xaxis: {
        categories: ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","00:00","01:00","02:00","03:00","04:00","05:00"],
        floating: false,
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        labels: {
          show: true,
          align: 'right',
          style: {
            colors: [],
            fontSize: '11px',
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 500,
          }
        },
        
      },
      title: {
        text: ""
      },
      tooltip: {
        y: {
          formatter: (value:any , { series, seriesIndex, dataPointIndex, w }: any) => {
            let Seriesname = w.globals.seriesNames[seriesIndex]
            let valueIndex = dataPointIndex
            let formattedValue = this.valueOfthePercentage(Seriesname, valueIndex).toLocaleString();
            return formattedValue + ' kWh'
          },
          
        }
      }
    };
  }

  valueOfthePercentage(metername:string, valueIndex:number){
    let index = this.HeatmapData.findIndex((item:any) => item.name === metername)
    return this.HeatmapData[index].data[valueIndex]
  }

  ngOnInit(): void {
      this.getCurrentDate()
  }

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  endpoint = 'meterheatmap'

  OnSelectedData(value:string){
    if(value){
      this.chartLoad = true
      let reqData = {
        Date: value
      }
      this.ApiData.postData(this.endpoint, reqData).subscribe(
        res => {
          this.HeatmapData = res
          // console.log(this.HeatmapData)
          let length = this.HeatmapData.length
          let ChartArray = []
          let FindMaxvalue = []
          for(let i=0; i<length; i++){
            FindMaxvalue.push(Math.max(...this.HeatmapData[i].percentage))
            let dict = {
              name: this.HeatmapData[i].name,
              data: this.HeatmapData[i].percentage
            }
            ChartArray.push(dict)
          }
          let colorRanges = [
            {
              from : 0,
              to: 0,
              name: "METER OFF",
              color: "#F8F6F4"
            },
            {
              from : 1,
              to: 10,
              name: "10%",
              color: "#6BCB77"
            },
            {
              from : 10,
              to: 25,
              name: "25%",
              color: "#54B435"
            },
            {
              from : 25,
              to: 50,
              name: "50%",
              color: "#00a62c"
            },
            {
              from : 50,
              to: 75,
              name: "75%",
              color: "#F1B963"
            },
            {
              from : 75,
              to: 100,
              name: "100%",
              color: "#F08C00"
            },
            {
              from : 100,
              to: Math.max(...FindMaxvalue),
              name: ">100%",
              color: "#DA2020"
            },
          ]
          this.chartOptions.series = ChartArray
          this.chartOptions.plotOptions.heatmap.colorScale = {ranges:colorRanges}
          this.chartLoad = false
        }
      )
      
    }
  }

  

}
