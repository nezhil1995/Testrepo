import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsService } from './analytics.service'
import { faDatabase, faPlugCircleBolt, faDiagramProject, faGaugeSimpleHigh, faFileMedical, faArrowsLeftRightToLine  } from '@fortawesome/free-solid-svg-icons'
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexLegend,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip
} from "ng-apexcharts";

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
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  data = faDatabase
  temp = faDiagramProject
  plug = faPlugCircleBolt
  peakO = faGaugeSimpleHigh
  health = faFileMedical
  ses = faArrowsLeftRightToLine

  load: boolean = false
  groupLoad = false
  meterLoad = false
  form!:FormGroup
  date:any
  chartName = 'Ovarall'

  hideLineChart: boolean = false;


  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  ngOnInit(): void {
    this.getCurrentDate()
  }


  resetChart(): void {
    this.barGrpchart.series = [];
    this.barGrpchart.labels = [];
    this.barGrpchart.title.text = ''
    this.SrcbarChart.series = [];
    this.SrcbarChart.xaxis.categories = [];
    this.SrcbarChart.title.text = '';

    if (this.chart2) {
      this.chart2.updateOptions(this.barGrpchart);
    }
    if (this.chart3) {
      this.chart3.updateOptions(this.SrcbarChart);
    }
  }



  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild('chart1') chart1!: ChartComponent;

  @ViewChild('chart2') chart2!: ChartComponent;
  @ViewChild('chart3') chart3!: ChartComponent;

  public piechart1: Partial<ChartOptions> | any;
  public barGrpchart: Partial<ChartOptions> | any;
  public SrcbarChart: Partial<ChartOptions> | any

  constructor(private ApiData: AnalyticsService) {

    this.form = new FormGroup({
      sessiondate: new FormControl('',Validators.required),
    })

    this.piechart1 = {
      series: [],
      labels: ["Non-Peak","Peak","Standard"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'SharpSans, sans-serif',
          fontSize: "14px",
        },
        formatter: function (val:number, opts:any) {
          var seriesData = opts.w.config.series[opts.seriesIndex];
          let formattedValue = seriesData.toFixed(2).toLocaleString();
          return formattedValue + ' kWh'
        }
      },
      chart: {
        width: '100%',
        type: "pie",
        fontSize: "14px",
        fontFamily: 'SharpSans, sans-serif',
        position: 'bottom',
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Session Report`,
            }
          }
        },
        events: {
          dataPointSelection: (event:MouseEvent, chartContext:any, config:any)=>
          {
            var DataIndex = config.dataPointIndex
            var Labels = config.w.config.labels
            var labelName
            this.selection = []
            this.barGrpchart.title = { text: ``, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020', fontWeight:  'bold',}}
            for(var i=0;i<Labels.length;i++)
            {
              if(DataIndex===i)
              {
                labelName = Labels[i]
                if(labelName===this.seriseKeyName[0]){
                  this.selection = this.peak
                  this.barGrpchart.title.text = labelName
                  this.chartName = labelName
                }
                else if(labelName===this.seriseKeyName[1]){
                  this.selection = this.nonpeak
                  this.barGrpchart.title.text = labelName
                  this.chartName = labelName
                }
                else if(labelName===this.seriseKeyName[2]){
                  this.selection = this.standard
                  this.barGrpchart.title.text = labelName
                  this.chartName = labelName
                }
              }
            }
            let series = [
              {
                name: 'Energy',
                data: this.selection
              }
            ]
            this.barGrpchart.series = series
            this.barGrpchart.xaxis.categories = this.GroupName
            this.barGrpchart.title = { text: `${this.chartName}`, align: 'center', style:{ fontSize:'16px', fontFamily:'SharpSans, sans-serif', fontWeight: 'bold', color:'#da2020'}}
            this.chart2.updateOptions(this.barGrpchart);
            // this.barGrpchart.title = { text: ``, align: 'center', style:{ fontSize:'13px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
          }
        }
      },
      colors: ["#008FFB","#00E396","#FF9C79"],
      legend: {
        position: "top",
        fontWeight: 'bold'
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = (Number(value)).toLocaleString();
            return formattedValue + ' kWh'
            }
          }
        }
    };


    this.barGrpchart = {
      series: [],
      chart: {
        width: '100%',
        type: "bar",
        fontSize: "14px",
        height: '100%',
        fontFamily: 'SharpSans, sans-serif',
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Session Report Groupwise`,
            }
          }
        },
        events: {
          dataPointSelection: (event:MouseEvent, chartContext:any, config:any)=>
          {
            var DataIndex = config.dataPointIndex
            var Labels = config.w.globals.labels
            var labelNamebar
            var categories = []
            var select = []
            for(var i=0;i<Labels.length;i++)
            {
              if(DataIndex===i){
                labelNamebar = Labels[i]
                var meterArr = this.MeterChartData.meterdata
                for(var i=0;i<meterArr.length;i++)
                {
                  if(labelNamebar===meterArr[i].group)
                  {
                    categories.push(meterArr[i].mtrname)
                    if(this.chartName===this.seriseKeyName[0]){
                      select.push(meterArr[i][this.seriseKeyName[0]])
                    }
                    else if(this.chartName===this.seriseKeyName[1]){
                      select.push(meterArr[i][this.seriseKeyName[1]])
                    }
                    else if(this.chartName===this.seriseKeyName[2]){
                      select.push(meterArr[i][this.seriseKeyName[2]])
                    }
                    else{
                      select.push(meterArr[i].overall)
                    }
                  }
                }
              }
            }
            let barseries =[
                {
                  name: labelNamebar,
                  data: select
                },
              ]
            this.SrcbarChart.series = barseries
            this.SrcbarChart.xaxis.categories = categories
            this.SrcbarChart.title.text = this.chartName + '-' + labelNamebar
            this.chart3.updateOptions(this.SrcbarChart);
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"]
        },
        offsetY:-17
        // formatter: function (val:any, opts:any) {
        //   var seriesData = opts.w.config.series[opts.seriesIndex];
        //   let formattedValue = seriesData.toLocaleString();
        //   return formattedValue + ' kWh'
        // }
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      colors: ["#008FFB","#00E396","#FF9C79","#F99417","#CDE990","#BA90C6"],
      legend: {
        show: false,
        position:'top',
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
      title:{
       
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = (Number(value)).toLocaleString();
            return formattedValue + ' kWh'
            }
          }
        }
    };

    this.SrcbarChart = {
      series: [],
      chart: {
        height: '100%',
        type: "bar",
        fontFamily:  'SharpSans, sans-serif',
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Session Report Meterwise`,
            }
          }
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true,
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
        show: false,
        position:'top',
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
      title:{
        text: '',
        align:'center',
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  'SharpSans, sans-serif',
          color:  '#da2020'
        },
      },
      tooltip: {
        y: {
          formatter: (value:any) => {
            let formattedValue = (Number(value)).toLocaleString();
            return formattedValue + ' kWh'
            }
          }
        }
    };

  }

  endpoint = 'analyticsoverall'
  chartData : any
  GroupChartData:any
  MeterChartData:any
  seriseKeyName: any[] = []
  timeKeyNamrayy : any[] = []
  time:any
  timeArr:any[] = []

  onSubmit(){
    if(this.form.valid){
      this.load = true
      this.groupLoad = true
      this.meterLoad = true
      // console.log(this.form.value)
      this.resetChart();
      this.timeArr = []
      this.timeKeyNamrayy = []
      this.chartData = null
      this.ApiData.postData('analyticsoverall', this.form.value).subscribe(
        res => {
          this.chartData = res
          this.seriseKeyName = []
          for (var key in this.chartData.overall[0]) {
            this.seriseKeyName.push(key);
          }
          for (var key in this.chartData.time) {
            this.timeKeyNamrayy.push(key);
          }
          let obj = {}
          this.time = this.chartData.time
          for(let i=0;i<this.timeKeyNamrayy.length;i++){
             obj = {
              sessionName : this.timeKeyNamrayy[i],
              time: this.time[this.timeKeyNamrayy[i]]
            }
            this.timeArr.push(obj)
          }
          this.Updatepiechart1()
          // this.UpdatebarGrpchart()
          this.load = false
        }
      )

      this.ApiData.postData('analyticsgroup',this.form.value).subscribe(
        res=>{
          this.GroupChartData = res
          this.UpdatebarGrpchart()
          this.groupLoad = false
        }
      )

      this.ApiData.postData('analyticsmeter', this.form.value).subscribe(
        res=>{
          this.MeterChartData = res
          this.UpdateMtrChart()
          this.meterLoad = false
        }
      )
    }
    else{
      this.resetChart();
    }
  }

  formateStr(val:string){
    return val.replace(' ', ' to ');
  } 

  Updatepiechart1(){
    var seriesArr = [this.chartData.overall[0][this.seriseKeyName[0]], this.chartData.overall[0][this.seriseKeyName[1]], this.chartData.overall[0][this.seriseKeyName[2]]]
    // console.log(seriesArr)
    var labelArr = this.seriseKeyName
    // console.log(labelArr)
    this.piechart1.series = seriesArr
    this.piechart1.labels = labelArr
  }

  peak: number[] = []
  nonpeak: number[] = []
  standard: number[] = []
  selection: number[] = []
  GroupName: string[] = []
  ovarall: number[] = []

  UpdatebarGrpchart(){
    var GroupArr = this.GroupChartData.groupwise
    this.GroupName = []
    this.peak = []
    this.nonpeak = []
    this.standard = []
    this.ovarall = []

    for(var i=0;i<GroupArr.length;i++){
      this.GroupName.push(GroupArr[i].groupname)
      this.peak.push(GroupArr[i][this.seriseKeyName[0]])
      this.nonpeak.push(GroupArr[i][this.seriseKeyName[1]])
      this.standard.push(GroupArr[i][this.seriseKeyName[2]])
      this.ovarall.push(GroupArr[i].overall)
    }

    let src = [
      {
        name: 'Energy',
        data: this.ovarall
      }
    ]
    this.chartName = 'Overall'
    this.barGrpchart.title.text = ''
    this.barGrpchart.series = src
    this.barGrpchart.xaxis.categories = this.GroupName
    this.barGrpchart.title = { text: `${this.chartName}`, align: 'center', style:{ fontSize:'16px', fontFamily:'SharpSans, sans-serif', fontWeight: 'bold', color:'#da2020'}}
  }

  
  UpdateMtrChart(){
    var MeterArr = this.MeterChartData.meterdata
    let meterOverll = [], metername = []
    for(var i = 0; i < MeterArr.length; i++){
      if(MeterArr[i].group === this.GroupName[0] ){
        meterOverll.push(MeterArr[i].overall)
        metername.push(MeterArr[i].mtrname)
      }
    }

    let meterSrc = [
      {
        name: 'Energy',
        data: meterOverll
      }
    ]

    this.SrcbarChart.series = meterSrc
    this.SrcbarChart.xaxis.categories = metername
  }



}
