import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import highcharts3D from 'highcharts/highcharts-3d';
import Histogram from 'highcharts/modules/histogram-bellcurve';
import More from 'highcharts/highcharts-more'
import Cylinder from 'highcharts/modules/cylinder';
More(Highcharts);
Histogram(Highcharts);
highcharts3D(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);
Cylinder(Highcharts);

@Component({
  selector: 'app-energy-predection',
  templateUrl: './energy-predection.component.html',
  styleUrls: ['./energy-predection.component.css']
})
export class EnergyPredectionComponent implements OnInit{

  load=true

  constructor(private ApiData:AnalyticsService){

  }

  getTrendLine(Data: [number, number][]){
    const n = Data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      const [x, y] = Data[i];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x ** 2;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = ((sumY * sumX2) - (sumX * sumXY)) / ((n * sumX2) - (sumX ** 2));
    const trendline = [];
    const minX = Math.min(...Data.map(([x]) => x));
    const maxX = Math.max(...Data.map(([x]) => x));
    trendline.push([minX, minX * slope + intercept]);
    trendline.push([maxX, maxX * slope + intercept]);
    console.log(trendline)
    return trendline;
  }

  PredictionData:any
  public ChartOptions:any
  Highcharts: typeof Highcharts = Highcharts;

  ngOnInit(){
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });
    this.ApiData.getData('analysisgraph').subscribe(
      res=>{
        this.PredictionData = res
        this.PredictionChart()
        this.load = false
      }
    )
  }

  PredictionChart(){
    this.ChartOptions = {
      title: {
        text: 'Energy Prediction for 2024'
      },
      Xaxis:{
        min: 0
      },
      yAxis: {
        min: 0
      },
      series: [
        {
          type: 'line',
          name: 'Trend Line',
          data: this.getTrendLine(this.PredictionData),
          marker: {
            enabled: false
          },
          states: {
            hover: {
              lineWidth: 0
            }
          },
          enableMouseTracking: false
        },
        {
          type: 'scatter',
          name: 'Energy Consumption',
          data: this.PredictionData,
          marker: {
            radius: 4
          }
        }
      ]
    }
  }

}
