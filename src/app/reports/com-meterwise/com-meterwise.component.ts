import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild, OnChanges} from '@angular/core';
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
  ApexTooltip
} from "ng-apexcharts";
import { CookieService } from 'ngx-cookie-service';
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
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-com-meterwise',
  templateUrl: './com-meterwise.component.html',
  styleUrls: ['./com-meterwise.component.css'],
  providers:[DatePipe]
})
export class ComMeterwiseComponent {

  load: boolean = false

  chartLoad: boolean = false

  form:FormGroup;

  visiblechart = false

  date:any

  compwise = [
    "Today vs Yesterday",
    "Today vs Same day last week",
    "This week over Last week",
    "This month over Last month",
    "This Year Over Last year",
    "Last 24 Hrs over Previous 24 Hrs",
    "Custom"
  ]

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  groupname:any

  getData(){
    this.ReportApi.getData(this.getGroupEndpoint).subscribe(
      res=>{
        this.chartData = res
        this.groupname = this.chartData.groupname
        this.load = false
    })
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private ReportApi: ReportsService, private Cookie: CookieService, private datePipe:DatePipe)
  {
    this.form = new FormGroup({
      type: new FormControl(''),
      starttime: new FormControl(''),
      endtime: new FormControl(''),
      plantname: new FormControl(''),
      mtrname: new FormControl(''),
      cmptype: new FormControl('',Validators.required),
      cmpstrtdate1: new FormControl(''),
      cmpenddate1: new FormControl(''),
      cmpstrtdate2: new FormControl(''),
      cmpenddate2: new FormControl(''),
      cmpplantname: new FormControl(''),
      cmpmetername: new FormControl(''),
      daterange1: new FormControl(''),
      daterange2: new FormControl(''),
    });

    this.chartOptions = {
      series: [
        {
          name: 'distibuted',
          data: []
        },
      ],
      chart: {
        height: '100%',
        width: '350%',
        type: "bar",
        zoom: { enabled: false },
        fontFamily: 'SharpSans, sans-serif',
      },
      colors: [],
      plotOptions: {
        bar: {
          columnWidth: "55%",
          distributed: false,
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
          fontSize: "10px",
        },
        offsetY:-17
      },
      legend: {
        show: true,
        position:'top',
        fontSize: '14px',
        fontFamily: 'SharpSans, sans-serif',
        horizontalAlign: 'left',
      },
      grid: {
        show: true,
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      xaxis: {
        categories: [],
        floating: false,
        labels: {
          style: {
            fontSize: "10px",
            fontFamily: 'SharpSans, sans-serif',
            fontWeight: 'bold'
          }
        }
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

  formatNumber(num:number) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num.toString();
    }
  }

  ngOnInit(): void {
    window.scroll(0,0)
    this.getCurrentDate();
    // this.getData()
  }

  onTypeChange(value:string){
    if(this.form.controls['cmptype']?.value != 'Custom'){
      this.selectedFormType(value)
      this.Onsubmit(this.form.value)
    }
  }

  rangeDates1!: Date[];
  rangeDates2!: Date[];
  @ViewChild('calendar1') private calendar1: any;
  @ViewChild('calendar2') private calendar2: any;
  maxDate = new Date();
  Payload:any

  onDateRangeSelect(){
    const selectedDates1 = this.form.controls['daterange1']?.value;
    const selectedDates2 = this.form.controls['daterange2']?.value;
    if (selectedDates1[0] && selectedDates1[1] && selectedDates2[0] && selectedDates2[1]){
      this.Payload={
        type: "",
        starttime: "",
        endtime: "",
        plantname: "",
        mtrname:"",
        cmptype: "Custom",
        cmpstrtdate1: this.datePipe.transform(selectedDates1[0], 'yyyy-MM-dd'),
        cmpenddate1: this.datePipe.transform(selectedDates1[1], 'yyyy-MM-dd'),
        cmpstrtdate2: this.datePipe.transform(selectedDates2[0], 'yyyy-MM-dd'),
        cmpenddate2: this.datePipe.transform(selectedDates2[1], 'yyyy-MM-dd'),
        cmpplantname: this.Cookie.get('plantname'),
        cmpmetername: "",
      }
      this.Onsubmit(this.Payload)
      if(this.rangeDates2[1] !== null){
        this.calendar2.overlayVisible=false;
      }
    }
  }

  Onsubmit(formValue:any){
    this.chartLoad = true
    if (this.form.valid){
      this.UpdateLinechart(formValue);
      this.title = this.form.get('cmptype')?.value;
      if (this.chartData && this.chartData.scheduledchart && this.chartData.scheduledchart.cmpgrpname) {
        this.chartOptions.xaxis.categories = this.chartData.scheduledchart.cmpgrpname;
        // this.chartLoad = false;
      }
    }
    else {
      this.title = ''
    }
  }

  title = ''
  selectedEndpoint = 'Selected'
  endpoint = 'reportgraph'
  getGroupEndpoint = 'overviewdashboard'
  chartData:any
  splitCompwise:any


  UpdateLinechart(form:any) {
    this.ReportApi.postData(this.endpoint, form).subscribe(
      res => {
        this.chartData = res;
       
        // console.log(this.chartData.comparisonchart1.cmpmtrname)

        const cmptypeValue = this.form.get('cmptype')?.value;
        const cmptypeArray = Array.isArray(cmptypeValue) ? cmptypeValue : [cmptypeValue];
        this.splitCompwise = cmptypeArray.map((item: string) => item.split(/vs|Over|over/));

        // console.log(this.chartData.comparisonchart1.cmpmtr1ec[0]['2000TA'].energycons)
        let cmp1 = [], cmp2 = []

        let lencmp1 = this.chartData.comparisonchart1.cmpmtr1ec.length
        let lencmp2 = this.chartData.comparisonchart1.cmpmtr2ec.length
        let cmp1totalEnergyCons = 0;
        let cmp2totalEnergyCons = 0;

        // console.log(lencmp1, lencmp2)

        for(let i = 0; i < lencmp1; i++) {

          this.chartData.comparisonchart1.cmpmtr1ec[i][this.chartData.comparisonchart1.cmpmtrname[i]].forEach((item: any) => {
            cmp1totalEnergyCons += item.energycons;
          });

          this.chartData.comparisonchart1.cmpmtr2ec[i][this.chartData.comparisonchart1.cmpmtrname[i]].forEach((item: any) => {
            cmp2totalEnergyCons += item.energycons;
          });

          cmp1.push(Number((cmp1totalEnergyCons).toFixed(2)));
          cmp2.push(Number(cmp2totalEnergyCons.toFixed(2)));

        }

        // console.log(cmp1)
        // console.log(cmp2)

        let areachart = [
          {
            name: this.splitCompwise[0][0],
            data: cmp1
          },
          {
            name: this.splitCompwise[0][1],
            data: cmp2
          }
        ];

        this.chartOptions.xaxis.categories = this.chartData.comparisonchart1.cmpmtrname;
        this.chartOptions.series = areachart;
        this.visiblechart = true;
        this.chartLoad = false;
      }
    );
  }

  selectedFormType(value: any) {
    switch (value) {
      case "Today vs Yesterday":
        const currentDate = new Date().toISOString().slice(0, 10);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().slice(0, 10);
        this.form.get('cmpstrtdate1')?.setValue(currentDate);
        this.form.get('cmpenddate1')?.setValue(currentDate);
        this.form.get('cmpstrtdate2')?.setValue(yesterdayDate);
        this.form.get('cmpenddate2')?.setValue(yesterdayDate);
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      case "Today vs Same day last week":
        const today = new Date().toISOString().slice(0, 10);
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekDate = lastWeek.toISOString().slice(0, 10);
        this.form.get('cmpstrtdate1')?.setValue(today);
        this.form.get('cmpenddate1')?.setValue(today);
        this.form.get('cmpstrtdate2')?.setValue(lastWeekDate);
        this.form.get('cmpenddate2')?.setValue(lastWeekDate);
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      case "This week over Last week":
        const today1 = new Date();
        const startOfWeek = new Date(today1.getFullYear(), today1.getMonth(), today1.getDate() - today1.getDay() + 1);
        const endOfWeek = new Date();
        const startOfWeekDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeekDate = endOfWeek.toISOString().slice(0, 10);
        const startOfLastWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - 1);
        const startOfLastWeekDate = startOfLastWeek.toISOString().slice(0, 10);
        const endOfLastWeekDate = endOfLastWeek.toISOString().slice(0, 10);
        this.form.get('cmpstrtdate1')?.setValue(startOfWeekDate);
        this.form.get('cmpenddate1')?.setValue(endOfWeekDate);
        this.form.get('cmpstrtdate2')?.setValue(startOfLastWeekDate);
        this.form.get('cmpenddate2')?.setValue(endOfLastWeekDate);
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      case "This month over Last month":
        const todayDate = new Date();
        todayDate.setDate(1);
        var num
        if (todayDate.getMonth() === 1) { // February
          const currentYear = todayDate.getFullYear();
          if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
            num = 28; // Leap year
          } else {
            num = 27; // Non-leap year
          }
          } else if (todayDate.getMonth() === 3 || todayDate.getMonth() === 5 || todayDate.getMonth() === 8 || todayDate.getMonth() === 10)
          {
            num = 32; // April, June, September, November
          } else
          {
            num = 31; // January, March, May, July, August, October, December
          }
        const startOfThisMonth = todayDate.toISOString().slice(0, 10);
        const endOfThisMonth = new Date().toISOString().slice(0, 10);
        const lastMonthDate = new Date();
        lastMonthDate.setDate(1)
        const startOfLastMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 2);
        const endOfLastMonth = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth()-1, num);

        const startOfLastMonthStr = startOfLastMonth.toISOString().slice(0, 10);
        const endOfLastMonthStr = endOfLastMonth.toISOString().slice(0, 10);

        this.form.get('cmpstrtdate1')?.setValue(startOfThisMonth);
        this.form.get('cmpenddate1')?.setValue(endOfThisMonth);
        this.form.get('cmpstrtdate2')?.setValue(startOfLastMonthStr);
        this.form.get('cmpenddate2')?.setValue(endOfLastMonthStr);
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      case "This Year Over Last year":
        const currentDate1 = new Date();
        const currentYear = currentDate1.getFullYear();

        const startOfThisYear = new Date(currentYear, 0, 2);
        const endOfThisYear = new Date(currentYear, currentDate1.getMonth(), currentDate1.getDate()+1);

        const startOfLastYear = new Date(currentYear - 1, 0, 2);
        const endOfLastYear = new Date(currentYear - 1, 11, 32);

        this.form.get('cmpstrtdate1')?.setValue(startOfThisYear.toISOString().slice(0, 10));
        this.form.get('cmpenddate1')?.setValue(endOfThisYear.toISOString().slice(0, 10));
        this.form.get('cmpstrtdate2')?.setValue(startOfLastYear.toISOString().slice(0, 10));
        this.form.get('cmpenddate2')?.setValue(endOfLastYear.toISOString().slice(0, 10));
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      case "Last 24 Hrs over Previous 24 Hrs":
        const currentDateTime = new Date().toISOString().slice(0, 10);
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const twentyFourHoursAgoDateTime = twentyFourHoursAgo.toISOString().slice(0, 10);
        this.form.get('cmpstrtdate1')?.setValue(currentDateTime);
        this.form.get('cmpenddate1')?.setValue(currentDateTime);
        this.form.get('cmpstrtdate2')?.setValue(twentyFourHoursAgoDateTime);
        this.form.get('cmpenddate2')?.setValue(twentyFourHoursAgoDateTime);
        this.form.get('cmpplantname')?.setValue(this.Cookie.get('plantname'));
        break;

      default:
        // Handle other cases or provide a default action
        break;
    }
  }



}
