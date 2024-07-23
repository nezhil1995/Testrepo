import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from '../reports.service';
import * as XLSX from 'xlsx-js-style';
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
  ApexTooltip
} from "ng-apexcharts";

import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

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
};

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css'],
})
export class HistoricalComponent implements OnInit {

  // Gokulraj.Rajasekaran@motherson.com
  meter = faFileExcel

  load: boolean = true

  chartLoad: boolean = false

  form!:FormGroup;

  visiblechart = true

  maxDate!: Date;

  metername : any

  meterNameDrop: any[] =[]

  TableData:any

  HourlyData : any

  rangeDates!: Date[];

  getCurrentDate() {
    this.maxDate = new Date();
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;


  constructor(private ReportApi: ReportsService,)
  {
    this.form = new FormGroup({
      dateRange: new FormControl('', Validators.required),
      hvr_from: new FormControl('',),
      hvr_to: new FormControl('', Validators.required),
      hvr_mname: new FormControl('',Validators.required),
    });


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
          shadeIntensity: 0.5,
          inverse: false,
          useFillColorAsStroke: false,
          colorScale: {},
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
          align: 'center',
          style: {
            colors: [],
            fontSize: '12px',
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
          formatter: (value:any) => {
            let formattedValue = value.toLocaleString();
            return formattedValue + ' kWh'
          }
        }
      }
    };

  }


  onDateRangeSelect() {
    const selectedDates = this.rangeDates;
    if (selectedDates.length === 2) {
      const [fromDate, toDate] = selectedDates;
      const fromDateFormatted = this.formatDate(fromDate);
      const toDateFormatted = this.formatDate(toDate);
      this.form.patchValue({
        hvr_from: fromDateFormatted,
        hvr_to: toDateFormatted,
      });
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

  title = ''
  chartData: any[] = []

  ngOnInit(): void {
    this.getCurrentDate()
    this.GetMtrData()
  }

  onSubmit(){
    this.chartLoad = true
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      delete formValue.dateRange;
      this.title = this.form.get('hvr_mname')?.value;
      // console.log(formValue);
      this.GetTableData(formValue)
    }
    else {
      this.title = ''
      this.TableData = null
    }
  }

  isToDateValid(): boolean {
    const fromDateValue = this.form.controls['fromDate'].value;
    const toDateValue = this.form.controls['toDate'].value;
    return fromDateValue && !toDateValue && new Date(toDateValue) >= new Date(fromDateValue);
  }

  HisEndpoint = 'haourData'
  meterEndpoint = 'metername'

  endpoint = 'virtualhourly'

  GetMtrData(){
    this.ReportApi.getData(this.meterEndpoint).subscribe(res=>{
      this.metername = res
      this.meterNameDrop = this.metername.meters
      this.load = false
    })
  }

  GetTableData(form:any){
    this.ReportApi.postData(this.endpoint, form).subscribe(res=>{
      this.TableData=res
      this.HourlyData = this.TableData.Hourly_Data
      this.chartData = this.TableData.heatmap
      this.UpdateHeatmapChart(this.TableData.meterthresValue)
      this.chartLoad = false;
    })
  }

  UpdateHeatmapChart(Val:number){
    let ChartArray = []
    let numberArray = []
    let getMaxArray = []
    for(const data of this.chartData){
      let dict = {
        name: data.Date,
        data: data.Data
      }
      let Datastring = data.Data
      numberArray = Datastring.map(function (str:any) {
        return parseFloat(str);
      });
      //find the max value 
      let maxNumber = Math.max(...numberArray);
      getMaxArray.push(maxNumber);
      ChartArray.push(dict)
    }
    // console.log(getMaxArray)
    // console.log(this.chartData)
    this.chartOptions.series = ChartArray
    let chartseriesLen = this.chartOptions.series.length
    let thresholdValue = Val || 0
    let maxValue = Math.max(...getMaxArray)
    var colorRanges = [];

    // Calculate the step size
    var stepSize = thresholdValue / 5;
    var from, to
    colorRanges.push({ from : 0, to: 0.1, name: "METER OFF", color: "#EEEEEE" })

    for (var i = 0; i < 5; i++) {
      from = i * stepSize;
      if( i === 0){
        from = 0.01;
      }
      to = (i + 1) * stepSize;
      colorRanges.push({
          from: Number(from.toFixed(2)),
          to: Number(to.toFixed(2)),
          name: "",
          color: this.ColorSteps(i),
      });
    }

    colorRanges.push({ from : thresholdValue, to: Math.round(maxValue+1), name: "", color: "#DA2020" })
    // console.log(colorRanges)
    this.chartOptions.plotOptions.heatmap.colorScale = {ranges:colorRanges}

    if (chartseriesLen < 8) {
      let height = `${chartseriesLen * 10}%`;
      this.chartOptions = {
        ...this.chartOptions,
        chart: {
          ...this.chartOptions.chart,
          height: height,
        },
      };
    } else {
      this.chartOptions = {
        ...this.chartOptions,
        chart: {
          ...this.chartOptions.chart,
          height: '100%',
        },
      };
    }

  }

  ColorSteps(color:number): any{
    switch(color){
      case 0: return '#6BCB77'
        break;
      case 1: return '#54B435'
        break;
      case 2: return '#00a62c'
        break;
      case 3: return '#F1B963'
        break;
      case 4: return '#F08C00'
        break;
    }
  }

  exportData(){
    let chartdata = this.chartOptions.series

    const sheetname = 'sheet1';
    let Heading = [[`Hourly Data ${this.title}`]];
    const sheetdata = chartdata.map ((series: { name: any; data: any[]; }) =>{
      return {
        'DATE': series.name,
        '06:00' : series.data[0],
        '07:00' : series.data[1],
        '08:00' : series.data[2],
        '09:00' : series.data[3],
        '10:00' : series.data[4],
        '11:00' : series.data[5],
        '12:00' : series.data[6],
        '13:00' : series.data[7],
        '14:00' : series.data[8],
        '15:00' : series.data[9],
        '16:00' : series.data[10],
        '17:00' : series.data[11],
        '18:00' : series.data[12],
        '19:00' : series.data[13],
        '20:00' : series.data[14],
        '21:00' : series.data[15],
        '22:00' : series.data[16],
        '23:00' : series.data[17],
        '00:00' : series.data[18],
        '01:00' : series.data[19],
        '02:00' : series.data[20],
        '03:00' : series.data[21],
        '04:00' : series.data[22],
        '05:00' : series.data[23],
      }
  })

  //Had to create a new workbook and then add the header
  const wb = XLSX.utils.book_new();
  const merge = [
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 }  },
  ];
  const ws = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A2'} );
  ws["!merges"] = merge;

  //Starting in the next row to avoid overriding on header names
  XLSX.utils.sheet_add_json(ws,sheetdata, {origin: 'A4' , skipHeader: false });

  for (var i in ws) {
    // console.log(ws[i]);
    if (typeof ws[i] != 'object') continue;
    let cell = XLSX.utils.decode_cell(i);
    ws[i].s = {
      font: {
        name: 'arial',
        sz:9
        // bold: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
      border: {
        right: {style: 'thin'},
        left: {style: 'thin'},
        top : {style: 'thin'},
        bottom: {style: 'thin'},
      },
    }
    if (cell.r == 1) {
      ws[i].s = {
        font: {
          name: 'arial',
          bold:true,
          color: { rgb: "FFFFFF" },
          sz:10
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
      },
      ws[i].s.fill = {
        // background color
        patternType: 'solid',
        fgColor: { rgb: 'da2127' },
        bgColor: { rgb: 'da2127' },
      };
    }

    if (cell.r == 3) {
      ws[i].s = {
        font: {
          name: 'arial',
          bold:true,
          color: { rgb: "FFFFFF" },
          sz:10
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
        border: {
          right: {style: 'thin'},
          left: {style: 'thin'},
          top : {style: 'thin'},
          bottom: {style: 'thin'},
        }
      }
      ws[i].s.fill = {
        // background color
        patternType: 'solid',
        fgColor: { rgb: 'da2127' },
        bgColor: { rgb: 'da2127' },
      };
    }

    ws['!cols'] = [
      { width: 15 }
    ];
  }

  XLSX.utils.book_append_sheet(wb,ws, sheetname);
  XLSX.writeFile(wb, `${this.title} Hourly Data .xlsx`)

  }


}
