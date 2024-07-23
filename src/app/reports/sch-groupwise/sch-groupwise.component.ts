import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import { FormResponse } from '../Data';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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
  ApexTooltip,
  ApexFill
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';

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
  fill: ApexFill
};

@Component({
  selector: 'app-sch-groupwise',
  templateUrl: './sch-groupwise.component.html',
  styleUrls: ['./sch-groupwise.component.css'],
  providers:[DatePipe]
})
export class SchGroupwiseComponent implements OnInit, OnDestroy {

  check = faCheck

  load: boolean = false

  chartLoad: boolean = true

  form:FormGroup;
  maxDate = new Date();

  visiblechart = false

  date:any
  rangeDates!: Date[];

  formData: FormResponse[] = []

  metername = [
    "Today",
    "Yesterday",
    "This Week",
    "Last 7 days",
    "This Month",
    "Last 30 days"
  ]

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private ReportApi: ReportsService, private Cookie: CookieService, private datePipe:DatePipe)
  {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      starttime: new FormControl(''),
      endtime: new FormControl(''),
      plantname: new FormControl(''),
      mtrname: new FormControl(''),
      cmptype: new FormControl(''),
      cmpstrtdate1: new FormControl(''),
      cmpenddate1: new FormControl(''),
      cmpstrtdate2: new FormControl(''),
      cmpenddate2: new FormControl(''),
      cmpplantname: new FormControl(''),
      cmpmetername: new FormControl(''),
      daterange: new FormControl('')
    });


    this.chartOptions = {
      series: [
        {
          name: 'Kg co2',
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
          borderRadiusApplication: 'end',
          borderRadius: 25,
          endingShape: "rounded",
          dataLabels: {
            position: 'top',
          },
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
        pattern: {
          style: 'squares',
          width: 6,
          height: 6,
          strokeWidth: 2,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val:any) => {
          return this.formatNumber(val)
        },
        style: {
          fontFamily: 'SharpSans, sans-serif',
          colors: ["#7D7C7C"]
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
            fontSize: "14px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
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

  ngOnInit(): void {
    this.getCurrentDate();
  }

  ngOnDestroy(): void {

  }

  title = ''
  selectedEndpoint = 'Selected'
  chartData:any
  endpoint = 'reporttable'
  @ViewChild('calendar') private calendar: any;

  onTypeChange(value:any){
    if(value && this.form.controls['type']?.value != 'Custom'){
      this.selectedFormType(value)
      // console.log(this.form.value);
      this.chartLoad = true;
      this.Onsubmit(this.form.value)
    }
  }


  Onsubmit(formVal:any){
    if (this.form.valid && this.form.controls['type']?.value != 'Custom') {
      this.UpdateLinechart(formVal);
      this.title = this.form.get('type')?.value;
      this.visiblechart = true
    }
    else {
      this.visiblechart = false;
      this.chartLoad = true;
      this.title = ''
    }
  }

  onDateRangeSelect(){
    const selectedDates = this.form.controls['daterange']?.value;
    if (selectedDates[0] && selectedDates[1]){
      let Payload={
        type: "Custom",
        starttime: this.datePipe.transform(selectedDates[0], 'yyyy-MM-dd'),
        endtime: this.datePipe.transform(selectedDates[1], 'yyyy-MM-dd'),
        plantname: this.Cookie.get('plantname'),
        mtrname: "",
        cmptype: "",
        cmpstrtdate1: "",
        cmpenddate1: "",
        cmpstrtdate2: "",
        cmpenddate2: "",
        cmpplantname: "",
        cmpmetername: "",
      }
      this.UpdateLinechart(Payload)
      if(this.rangeDates[1] !== null){
        this.calendar.overlayVisible=false;
      }
    }
  }

  UpdateLinechart(form:any) {
    console.log("apiData Payloaf",form)
    if (!this.form.valid) {
      this.chartLoad = true;
    }
    this.selectedFormType(this.form.get('type')?.value)
    this.ReportApi.postData(this.endpoint, form).subscribe(
      res => {
        this.chartData = res;
        let areachart = [{
          name: 'kWh',
          data: this.chartData.scheduledchart.groupec.map((value:any) => Number(value.toFixed(3)))
        }];
        this.chartOptions.xaxis.categories = this.chartData.scheduledchart.lblmtr;
        this.chartOptions.series = areachart;
        this.chartOptions.colors = [
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#546E7A"
        ];
        this.visiblechart = true;
        this.chartLoad = false;
      }
    );
  }

  selectedFormType(value: string): void {
    switch (value) {
      case 'Today':
        const currentDate = new Date().toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(currentDate);
        this.form.controls['endtime'].setValue(currentDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'Yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(yesterdayDate);
        this.form.controls['endtime'].setValue(yesterdayDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'This week':
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
        const endOfWeek = new Date();
        const startOfWeekDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeekDate = endOfWeek.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(startOfWeekDate);
        this.form.controls['endtime'].setValue(endOfWeekDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'last 7 days':
        const yesterday1 = new Date();
        yesterday1.setDate(yesterday1.getDate() - 1);
        const sevenDaysAgo = new Date(yesterday1);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0, 10);
        const yesterdayDate1 = yesterday1.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(sevenDaysAgoDate);
        this.form.controls['endtime'].setValue(yesterdayDate1);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'This month':
        const currentDate1 = new Date();
        currentDate1.setDate(1);
        const startOfMonthDate = currentDate1.toISOString().slice(0, 10);
        const endOfMonthDate = new Date().toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(startOfMonthDate);
        this.form.controls['endtime'].setValue(endOfMonthDate);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;

      case 'last 30days':
        const currentDate2 = new Date();
        currentDate2.setDate(currentDate2.getDate() - 1);
        const thirtyDaysAgo = new Date(currentDate2);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().slice(0, 10);
        const currentDateISO = currentDate2.toISOString().slice(0, 10);
        this.form.controls['starttime'].setValue(thirtyDaysAgoDate);
        this.form.controls['endtime'].setValue(currentDateISO);
        this.form.controls['plantname'].setValue(this.Cookie.get('plantname'));
        break;
    }
  }




}
