import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import highcharts3D from 'highcharts/highcharts-3d';
import Histogram from 'highcharts/modules/histogram-bellcurve';
import More from 'highcharts/highcharts-more'
import Cylinder from 'highcharts/modules/cylinder';
import { AnalyticsService } from '../analytics.service';
More(Highcharts);
Histogram(Highcharts);
highcharts3D(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);
Cylinder(Highcharts);

@Component({
  selector: 'app-peak-session',
  templateUrl: './peak-session.component.html',
  styleUrls: ['./peak-session.component.css']
})
export class PeakSessionComponent implements OnInit {


  form:FormGroup
  date:any
  load: boolean = false
  public ChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  ngOnInit(): void {
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });
    this.getCurrentDate()
  }

  constructor(private Apidate:AnalyticsService){
    this.form = new FormGroup({
      date: new FormControl('', Validators.required),
      type:  new FormControl('')
    })
  }

  ChartData:any
  UpdateChartEngData:any
  UpdateChartCostData:any
  updateFlag=false

  OnSelectChange(value:any){
    this.ChartOptions.series = null
    if(value=='Energy'){
      this.ChartOptions.title = {
         text: 'Sessionwise Energy Consumption'
      }
      this.ChartOptions.series = JSON.parse(JSON.stringify(this.UpdateChartEngData));
    }
    else if(value=='Cost'){
      this.ChartOptions.title = {
        text: 'Sessionwise Cost Data'
      }
      this.ChartOptions.series = JSON.parse(JSON.stringify(this.UpdateChartCostData));
    }
    this.updateFlag = true;
    // console.log(this.ChartOptions)
  }

  OnDateSelect(){
    this.load=true
    if(this.form.valid){
      this.Apidate.postData('peakoffpeakchart',this.form.value).subscribe(
        res=>{
          this.ChartData = res
          this.UpdateChartEngData=this.ChartData.series
          this.UpdateChartCostData =this.ChartData.costseries
          this.form.controls['type'].setValue('Energy')
          this.ApplyChartOptions(this.ChartData.labels, this.ChartData.series)
          this.load=false
          this.OnSelectChange('Energy')
        }
      )
    }
  }

  ApplyChartOptions(Xcata:any, SeriesData:any){
    const color0 = Highcharts.getOptions()?.colors?.[0] || 'defaultColor';
    const rgba = Highcharts.color(color0).setOpacity(0).get('rgba') || 'defaultRGBA';

    this.ChartOptions = {
      chart: {
        type: 'areaspline',
        zoomType: 'x',
      },
      colors:['#058DC7', '#64E572', '#ED561B'],
      exporting: {
        buttons: {
          contextButton: {
              symbol: 'url(../../assets/download.png)'
          }
        },
        filename:'Sessionwise Energy '
      },
      accessibility: {
          description: '',
      },
      time: {
        useUTC: true
      },
      title: {
        text: 'Sessionwise Energy Consumption',
        margin:2,
        style:{
          fontSize: 14,
        }
      },
      subtitle: {
        text: '',
        style:{
          fontSize: 12,
          color: '#da2020'
        }
      },
      xAxis: {
        categories: Xcata,
        labels:{
          style:{
            fontSize:10,
          }
        },
        
      },
      legend: {
        enabled: true,
        verticalAlign:'top',
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5,
          dataLabels: {
            enabled: true,
            color:'#61677A',
            style: {
              fontSize:10,
            }
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true
              }
          }
        }
        },
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      tooltip: {
        enabled: false,
        shared: true,
        // crosshairs: true,
        split: true,
        style:{
          color:"#333333",
          fontSize:"11px"
        }
      },
      series: SeriesData
    }
  }

}
