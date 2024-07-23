import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
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
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

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
  tooltip: ApexTooltip;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-peak-off',
  templateUrl: './peak-off.component.html',
  styleUrls: ['./peak-off.component.css']
})
export class PeakOffComponent implements OnInit {

  load: boolean = true
  form:FormGroup
  SrcForm: FormGroup
  metersrc = ["Today","Yesterday","This Week","last7days","This Month","last30days","This Year","last12months"]

  forData:any
  ChartData:any
  title = ''

  DropdownData = [
    {
      name:'Today',
      value: 'Today'
    },
    {
      name:'Yesterday',
      value: 'Yesterday'
    },
    {
      name:'This Week',
      value: 'This Week'
    },
    {
      name:'Last 7 Days',
      value: 'last7days'
    },
    {
      name:'This Month',
      value: 'This Month'
    },
    {
      name:'Last 30 days',
      value: 'last30days'
    },
    {
      name:'This Year',
      value: 'This Year'
    },
    {
      name:'Last 12 Months',
      value: 'last12months'
    }
  ]
  
  DynamicUnitForHeader(value:string){
    let FindHeader = this.DropdownData.find((e)=>{
      return e.value === value
    })

    return FindHeader?.name
  }

  ngOnInit(): void {

  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public EnrChartOptions: Partial<ChartOptions> | any;

  constructor(private ApiData: AnalyticsService ) {

    this.form = new FormGroup({
      dateRange: new FormControl('',Validators.required)
    })

    this.SrcForm = new FormGroup({
      name: new FormControl('',Validators.required)
    })

    this.chartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "bar",
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
              filename: `perk off-peak Demand`,
            }
          }
        },
      },

      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: false,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
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
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 2,
        dashArray: 0, 
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

    this.EnrChartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "bar",
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
              filename: `perk off-peak Energy`,
            }
          }
        },
      },

      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: false,
          dataLabels: {
            position: 'top',
          },
          endingShape: "rounded"
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
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 2.2,
        dashArray: 0, 
      },
      title:{
        text: '',
        align:'center',
        offsetY: -2,
        style: {
          fontSize:  '15px',
          fontWeight:  'bold',
          fontFamily:  'SharpSans, sans-serif',
          color:  '#da2020'
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

  endpoint = 'peakoffpeak'


  rangeDates: Date[] = [];
  @ViewChild('calendar') private calendar: any;
  maxDate = new Date();

  onDateRangeSelect(){
    const selectedDates = this.rangeDates;
    if (selectedDates.length === 2) {
      this.load = true 
      const [fromDate, toDate] = selectedDates;
      const fromDateFormatted = this.formatDate(fromDate);
      const toDateFormatted = this.formatDate(toDate);
      let payload = {
        fromdate: fromDateFormatted,
        todate: toDateFormatted,
      };
      if(this.rangeDates[1] !== null){
        this.calendar.overlayVisible=false;
        this.onSubmit(payload)
      }
      
    }
  }

  formatDate(date: Date): string {
    if (date === null || date === undefined) {
      return '';
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
    
  }

  vis = false


  onSubmit(form:any){ 
    if(this.form.valid){
      this.vis=true
      this.ApiData.postData(this.endpoint, form).subscribe(
        res => {
          this.load = false
          this.forData = res
          this.ChartData = this.forData[0]
          this.UpdateChartData()
      })
    }
  }

  chartWidthLen: number = 0

  UpdateChartData(){
    let DataLength = this.ChartData.data.length
    let Data = this.ChartData.data
    let PeakArr = [],  NonPeakArr = [], cetagoryArr = [], EnePeakArr = [], EnrNonPeakArr = []
    for(let i=0;i<DataLength;i++){
      PeakArr.push(Data[i].peak)
      NonPeakArr.push(Data[i].npeak)
      cetagoryArr.push(Data[i].date)
    }

    let KvaSerieschart = [
      {
        name: "Peak",
        data: PeakArr
      },
      {
        name: "Off-Peak",
        data: NonPeakArr
      }
    ]
    var cetagoryArrlen = cetagoryArr.length
    if(cetagoryArrlen <= 12){
      this.chartWidthLen = 100
      this.chartOptions.chart.type = 'bar'
      this.chartOptions.dataLabels.enabled = true
      this.EnrChartOptions.chart.type = 'bar'
      this.EnrChartOptions.dataLabels.enabled = true
    }
    else{
      this.chartWidthLen = 100
      this.chartOptions.chart.type = 'line'
      this.chartOptions.dataLabels.enabled = false
      this.EnrChartOptions.chart.type = 'line'
      this.EnrChartOptions.dataLabels.enabled = false
    }
    var width = `${this.chartWidthLen}%`
    this.chartOptions.xaxis.categories = cetagoryArr
    this.chartOptions.series = KvaSerieschart

    this.SrcvalueDrop = []
    let Energydata = this.forData[1]
    this.DefaultSrc = Energydata.source[0]
    this.SrcvalueDrop = Energydata.source
    this.onSrcChange(Energydata.source[0])

  }

  DefaultSrc=''
  SrcvalueDrop = []

  onSrcChange(src:string){
    let FindSrc = this.forData[1].energy
    let EngPeak = [], EngOffpeak = [], xCata = []
    for(let i=0;i<FindSrc.length;i++){
      if(src == FindSrc[i].src){
        xCata.push(FindSrc[i].date)
        EngPeak.push(FindSrc[i].peak)
        EngOffpeak.push(FindSrc[i].npeak)
      }
    }

    let EngSeries = [
      {
        name: "Peak",
        data: EngPeak
      },
      {
        name: "Off-Peak",
        data: EngOffpeak
      }
    ]
    this.EnrChartOptions.xaxis.categories = xCata
    this.EnrChartOptions.series = EngSeries
    this.EnrChartOptions.title.text = src
  }

}
