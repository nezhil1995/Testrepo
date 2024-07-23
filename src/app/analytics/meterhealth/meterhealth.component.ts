import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
import { faFileExcel, faImage } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
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
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-meterhealth',
  templateUrl: './meterhealth.component.html',
  styleUrls: ['./meterhealth.component.css']
})
export class MeterhealthComponent implements OnInit, AfterViewInit {

  form!:FormGroup
  date5 = new Date().toISOString().slice(0, 10)
  TableData:any
  load = true
  vis = false
  meter = faImage

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this.tableContainer) {
      this.tableContainer.nativeElement; 
    }
  }

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private ApiData: AnalyticsService) {

    this.form = new FormGroup({
      date: new FormControl('',Validators.required),
    })

    this.chartOptions = {
      series: [],
      chart: {
        height: '100%',
        type: "heatmap",
        fontFamily: 'SharpSans, sans-serif',
        toolbar: {
          tools: {
            download: '<img src="../../assets/download.png" width="15">',
          },
          export: {
            png: {
              filename: `Meter health report`,
            }
          }
        },
      },
      plotOptions: {
        heatmap: {
          radius: 2,
          enableShades: false,
          distributed: true,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                name: "OFF",
                color: "#FF6969"
              },
              {
                from: 1,
                to: 10,
                name: "ON",
                color: "#00A100"
              }
            ]
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
            if(value === 1){
              return "ON"
            }
            else{
              return "OFF"
            }
              
          }
        }
      }
    };

  }

  endpoint = 'meterhealth'
  titleDate = ''
  StatusData:any

  onSubmit(){
    if(this.form.valid){
      this.load = true
      this.vis = true
      this.titleDate = this.form.get('date')?.value
      this.ApiData.postData(this.endpoint,this.form.value).subscribe(
        res =>{
          this.TableData = res
          this.StatusData = this.TableData.status
          let ChartSeriesdata = []
          for(let i=0; i<this.StatusData.length; i++){
            let obj = {
              name: this.StatusData[i].metername,
              data: this.StatusData[i].health
            }
            ChartSeriesdata.push(obj)
          }
          this.chartOptions.series = ChartSeriesdata
          this.chartOptions.title = { text: `METER CONNECTIVITY REPORT ON ${this.form.get('date')?.value}`, align: 'center', style:{ fontSize:'14px', fontFamily:'SharpSans, sans-serif', color:'#da2020'}}
          // console.log(this.TableData)
          this.load = false
      })
    }
  }

  exportImg() {
  const tableContainer = document.getElementById('tableContainer');
  if (tableContainer) {
    html2canvas(tableContainer, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // Adjust scale as needed
      windowWidth: tableContainer.scrollWidth,
      windowHeight: tableContainer.scrollHeight,
    }).then(canvas => {
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `Meter Health Report on ${this.titleDate}`;
      a.click();
    });
  }
  }
  
  ExportImg(){
    if (this.tableContainer) {
      const tableElement = this.tableContainer.nativeElement;
      html2canvas(tableElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = imgData;
        a.download = `Meter Health Report on ${this.titleDate}`;
        a.click();
      });
    }
  }

  exportData(){
    const container = document.getElementById('tableContainer');
      if (!container) {
        console.error("No element found with ID 'tableContainer'");
        return;
      }

      html2canvas(container, { useCORS: true, scrollX: window.scrollX }).then(canvas => {
        const image = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
        link.href = image;
        link.download = `Meter Health Report on ${this.titleDate}`;
        link.dispatchEvent(new MouseEvent('click'));
      });
  }

}
