import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RCorbonService } from '../r-corbon.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTheme
} from "ng-apexcharts";
import { DatePipe } from '@angular/common';

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
  theme: ApexTheme;
};

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  form :FormGroup
  form2 :FormGroup
  PostForm: FormGroup
  // SrcNameDrop:any
  RangeDrop:any
  date: any
  load = false
  load2 = false

  SrcChartData: any
  LineChartData: any

  @Input() DropsrcNames: any

  ngOnInit(): void {
    this.RangeDrop = [
      { name: 'This Month', value:'thismonth' },
      { name: 'Last Month', value:'lastmonth'},
      { name: 'Last 6 Months', value:'last6months'},
      { name: 'This Year', value:'thisyear'},
      { name: 'Last Year', value:'lastyear'}
    ]
    // this.maxDate = new Date();
  }

  RangeText(value: string): string {
    const index = this.RangeDrop.findIndex((item:any) => item.value === value);
    return index !== -1 ? this.RangeDrop[index].name : '';
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public LinechartOptions: Partial<ChartOptions> | any;

  constructor(private datePipe: DatePipe, private Cookie: CookieService, private ApiData: RCorbonService) {

    this.form = new FormGroup({
      srcname: new FormControl('', Validators.required),
      droprange: new FormControl('', Validators.required),
    })

    this.form2 = new FormGroup({
      Source: new FormControl('', Validators.required),
      Year: new FormControl('', Validators.required),
    })

    this.PostForm = new FormGroup({
      type: new FormControl('', Validators.required),
      // startmonth: new FormControl('', Validators.required),
      // enddmonth: new FormControl('', Validators.required),
      // plantname: new FormControl('', Validators.required)
    })

    this.chartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "bar",
        fontFamily: 'SharpSans, sans-serif',
        zoom: { enabled: false },
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Emission`,
            }
          }
        },
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
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#000000"]
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
        categories:[],
        floating: false,
        labels: {
          style: {
            fontSize: "13px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
      }
    };

    this.LinechartOptions = {
      series: [
        {
          name: 'kWh',
          data: [200, 500, 841, 751, 238]
        },
      ],
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
              filename: `Emission`,
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
          // rotateAlways: true,
          style: {
            fontSize: "13px",
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
      }
    };
  }

  endpoint = 'analyticsrcarbon'
  linechartendpoint = 'yearlyemission'
  maxDate = new Date();

  OnvalueChange(value:string){
    if(value){
      this.load = true
      this.PostForm.controls['type'].setValue(value)
      // this.selectedFormType(value)
      // console.log(this.PostForm.value)
      this.ApiData.PostData(this.endpoint, this.PostForm.value).subscribe(
        res =>{
          this.SrcChartData = res
          this.updateChart()
          this.load = false
        }
      )
    }
  }

  updateChart(){
    let srcChartserire = [{
      name: 'Kg CO₂',
      data: this.SrcChartData.values
    }]
    this.chartOptions.series = srcChartserire
    this.chartOptions.xaxis.categories = this.SrcChartData.Data_Names
    // console.log(this.chartOptions.series, this.chartOptions.xaxis.categories)
  }

  OnSrcChange(name:string){
    if(name && this.form2.valid){
      this.load2 = true
      // console.log(this.form2.value)
      this.ApiData.PostData(this.linechartendpoint, this.form2.value).subscribe(
        res =>{
          this.LineChartData = res
          this.updateLineChart()
          this.load2 = false
        }
      )
    }
  }

  GetYearTableData(value:string){
    if(value){
      const year = this.datePipe.transform(this.form2.get('Year')?.value, 'yyyy');
      this.form2.controls['Year'].setValue(year)
    }
  }

  updateLineChart(){
    let lineChartserire = [{
      name: 'Kg CO₂',
      data: this.LineChartData.Values
    }]
    this.LinechartOptions.series = lineChartserire
    this.LinechartOptions.xaxis.categories = this.LineChartData.Month

  }

  selectedFormType(range: string) {
    switch (range) {

      case 'This Month':
        const currentDate1 = new Date();
        const year1 = currentDate1.getFullYear();
        const month1 = currentDate1.getMonth() + 1; // Adding 1 since months are zero-indexed
        const startOfMonthDate = `${year1}-${month1.toString().padStart(2, '0')}`;
        const endOfMonthDate = `${year1}-${month1.toString().padStart(2, '0')}`;
        this.PostForm.controls['startmonth'].setValue(startOfMonthDate);
        this.PostForm.controls['enddmonth'].setValue(endOfMonthDate);
        this.PostForm.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;
  
      case 'Last Month':
        const currentDate2 = new Date();
        currentDate2.setDate(0); // Set to last day of previous month
        const year2 = currentDate2.getFullYear();
        const month2 = currentDate2.getMonth() + 1;
        const startOfLastMonthDate = `${year2}-${month2.toString().padStart(2, '0')}`;
        const endOfLastMonthDate = `${year2}-${month2.toString().padStart(2, '0')}`;
        this.PostForm.controls['startmonth'].setValue(startOfLastMonthDate);
        this.PostForm.controls['enddmonth'].setValue(endOfLastMonthDate);
        this.PostForm.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;
  
        case 'Last 6 Months':
          const currentDate3 = new Date();
          const currentYear3 = currentDate3.getFullYear();
          const currentMonth3 = currentDate3.getMonth();
          const startYear = currentMonth3 >= 4 ? currentYear3 : currentYear3 - 1;
          const startMonth = currentMonth3 >= 4 ? currentMonth3 - 3 : currentMonth3 + 9;
          const endYear = currentYear3;
          const endMonth = currentMonth3;
          const startOfSixMonthsAgo = `${startYear}-${startMonth.toString().padStart(2, '0')}`;
          const endOfSixMonthsAgo = `${endYear}-${endMonth.toString().padStart(2, '0')}`;
          this.PostForm.controls['startmonth'].setValue(startOfSixMonthsAgo);
          this.PostForm.controls['enddmonth'].setValue(endOfSixMonthsAgo);
          this.PostForm.controls['plantname'].setValue(this.Cookie.get('plantname'));
          break;
  
      case 'This Year':
        const currentDate4 = new Date();
        const currentYear = currentDate4.getFullYear();
        const startOfYear = new Date(currentYear, 3, 1); // April is 3 because months are zero-indexed
        const endOfYear = new Date(currentDate4.getFullYear(), currentDate4.getMonth(), currentDate4.getDate());
        const startOfYearDate = `${startOfYear.getFullYear()}-${(startOfYear.getMonth() + 1).toString().padStart(2, '0')}`;
        const endOfYearDate = `${endOfYear.getFullYear()}-${(endOfYear.getMonth() + 1).toString().padStart(2, '0')}`;
        this.PostForm.controls['startmonth'].setValue(startOfYearDate);
        this.PostForm.controls['enddmonth'].setValue(endOfYearDate);
        this.PostForm.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;
      
      case 'Last Year':
        const currentDate5 = new Date();
        const currentYear5 = currentDate5.getFullYear();
        const startOfLastYear = new Date(currentYear5 - 1, 3, 1); // April is 3 because months are zero-indexed
        const endOfLastYear = new Date(currentYear5, 2, 31); // March is 2
        const startOfLastYearDate = `${startOfLastYear.getFullYear()}-${(startOfLastYear.getMonth() + 1).toString().padStart(2, '0')}`;
        const endOfLastYearDate = `${endOfLastYear.getFullYear()}-${(endOfLastYear.getMonth() + 1).toString().padStart(2, '0')}`;
        this.PostForm.controls['startmonth'].setValue(startOfLastYearDate);
        this.PostForm.controls['enddmonth'].setValue(endOfLastYearDate);
        this.PostForm.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;
    }
  }

}
