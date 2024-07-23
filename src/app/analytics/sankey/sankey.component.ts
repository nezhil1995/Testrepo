import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '../analytics.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

type SankeyDataTuple = [string, string, number];

interface Chartdata{
  from: string
  to: string
  value: number
}

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.css'],
  providers:[DatePipe]
})
export class SankeyComponent implements OnInit {


  seleter: any[] = ['Date Basis','Month Basis', 'Year Basis']
  DefaultSelect = 'Date Basis'
  TotalEngConsume:number = 0
  maxDate = new Date();
  DefaultDate = new Date()
  formType: FormGroup
  formMonth: FormGroup
  formYear: FormGroup
  formDate: FormGroup

  isCurrentDate(date: Date): boolean {
    const currentDate = new Date();
    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      date.toDateString() === currentDate.toDateString()
    );
  }

  ngOnInit() {
    window.scroll(0,0)
    this.GetdateData(this.DefaultDate)
    // this.getEchartData()
  }

  constructor(private ApiData: AnalyticsService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private datePipe: DatePipe) {

    this.formType = new FormGroup({
      selectedType: new FormControl('', Validators.required),
    })

    this.formDate = new FormGroup({
      selectDate: new FormControl('',Validators.required)
    });

    this.formMonth = new FormGroup({
      selectMonth: new FormControl('',Validators.required)
    });

    this.formYear = new FormGroup({
      selectYear: new FormControl('',Validators.required)
    });

  }

  sankeyPostData:any
  

  DataFeedEchart(Data:any){
    this.sankeyPostData = Data
    let linksData = this.sankeyPostData.link
    let Totalconsume = 0
    this.GoogleSankeydata = []
    this.linksData = []
    this.ColorsDataNames = []
    this.totalenergyData = 0
    for(let i = 0; i < linksData.length; i++){
      if(linksData[i].value===null){
        linksData[i].value = 0
      }
      else{
        var tempValue = linksData[i].value
        linksData[i].value = Number(tempValue).toFixed(2)
      }
      if(linksData[i].source === 'Total Consumption'){
        Totalconsume += Number(linksData[i].value)
      }
      this.linksData.push({
        source: linksData[i].source,
        target: linksData[i].target,
        value: Number(linksData[i].value)
      })
      this.GoogleSankeydata.push([linksData[i].source, linksData[i].target, Number(linksData[i].value)])
    }
    this.TotalEngConsume = Totalconsume
    this.DataNames = this.sankeyPostData.node
    let Namelen = this.DataNames.length
    this.genRandomcolors(Namelen)
    this.SankeyEchart()
  }

  FormTypeText:any
  BasisText = ''

  GetdateData(value:any){
    if(value){
      this.load = true
      var name = value
      var Month = this.datePipe.transform(name, 'yyyy-M-dd');
      var MonthNam = this.datePipe.transform(name, 'MMMM YYYY');
      var [date, month, Year] = Month?.split('/') ?? [];
      this.FormTypeText = Month;
      this.BasisText = ''
      const FormData ={
        Type: 'Date Basis',
        Date: Month,
        Month: null,
        Year: null
      }
      // console.log(FormData)
      this.ApiData.postData(this.endpoint, FormData).subscribe(
        res =>{
          this.sankeyPostData = null
          this.DataFeedEchart(res)
          this.load = false
        }
      )
    }
  }

  GetMonthData(value:any){
    if(value){
      this.load = true
      var name = value
      var Month = this.datePipe.transform(name, 'M/yyyy');
      var MonthNam = this.datePipe.transform(name, 'MMMM YYYY');
      var [ month, Year] = Month?.split('/') ?? [];
      this.FormTypeText = `${MonthNam?.toUpperCase()}`;
      this.BasisText = 'MONTH'
      const FormData ={
        Type: 'Month Basis',
        Date: null,
        Month: Number(month),
        Year: Number(Year)
      }
      // console.log(FormData)
      this.ApiData.postData(this.endpoint, FormData).subscribe(
        res =>{
          this.sankeyPostData = null
          this.DataFeedEchart(res)
          this.load = false
        }
      )
    }
  }

  GetYearData(value:any){
    if(value){
      this.load = true
      var name = value
      var Month = this.datePipe.transform(name, 'M/yyyy');
      var MonthNam = this.datePipe.transform(name, 'YYYY');
      var [ month, Year] = Month?.split('/') ?? [];
      this.FormTypeText = `${Year?.toUpperCase()}`;
      this.BasisText = 'YEAR'
      const FormData ={
        Type: 'Year Basis',
        Date: null,
        Month: null,
        Year: Number(Year)
      }
      // console.log(FormData)
      this.ApiData.postData(this.endpoint, FormData).subscribe(
        res =>{
          this.sankeyPostData = null
          this.DataFeedEchart(res)
          this.load = false
        }
      )
    }
  }

  // private root!: am5.Root;
  endpoint = 'sankeychart'
  SankeyChart: any
  load: boolean = true

  chartoptions!: any;
  SankeylinksData: any[] = []

  linksData: any[] = []
  DataNames: any[] = []

  ColorsDataNames: any[] =[]
  totalenergyData!: number


  getEchartData(){
    this.ApiData.getData(this.endpoint).subscribe(
      (res: any) => {
        this.SankeyChart = res
        let linksData = this.SankeyChart.link
        this.linksData = []
        this.totalenergyData = 0
        for(let i = 0; i < linksData.length; i++){
          if(linksData[i].value===null){
            linksData[i].value = 0
          }
          else{
            var tempValue = linksData[i].value
            linksData[i].value = Number(tempValue).toFixed(2)
          }
          this.linksData.push({
            source: linksData[i].source,
            target: linksData[i].target,
            value: Number(linksData[i].value)
          })
        }
        
        this.DataNames = this.SankeyChart.node
        let Namelen = this.DataNames.length
        this.genRandomcolors(Namelen)
        this.SankeyEchart()
        // console.log(this.linksData, this.ColorsDataNames)
        this.load = false
    })
  }

  genRandomcolors(length: number) {
    this.ColorsDataNames = []
    for (var i = 0; i < length; i++) {
      const randomColor = this.getRandomLightColor();
      this.ColorsDataNames.push(
        {
          name: this.DataNames[i].name,
          itemStyle: {
            color: randomColor,
            borderColor: randomColor,
          }
        }
      )
    }
  }

  getRandomLightColor() {
    // return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    var letters = 'ABCDEF0123456789'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  SankeyEchart(){
    this.chartoptions = {
      autoResize: true,
      animation: 'auto',
      animationDuration: 1000,
      animationDurationUpdate: 500,
      animationEasing: 'cubicInOut',
      animationEasingUpdate: 'cubicInOut',
      animationThreshold: 2000,
      progressiveThreshold: 3000,
      progressive: 400,
      hoverLayerThreshold: 3000,
      useUTC: false,
      textStyle:{
        fontFamily: 'SharpSans, sans-serif',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0000',
      },
      title: {
        subtext: `Total Consumption: ${(this.TotalEngConsume).toLocaleString()} kWh`,
        left: 20,
        top: -15,
        textStyle:{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#464646',
          fontFamily: 'SharpSans, sans-serif'
        }
      },
      series: [
        {
          type: 'sankey',
          layout: 'center',
          left: 50.0,
          top: 20.0,
          right: 150.0,
          bottom: 25.0,
          nodeGap: 10,
          nodeWidth: 5,
          lineStyle: {
            color: 'source',
            curveness: 0.159
          },
          emphasis: {
            focus: 'adjacency',
            verticalAlign: 'middle',
          },
          label: {
            fontFamily: 'SharpSans',
            fontSize: 11,
            padding: 5,
            verticalAlign: 'middle',
          },
          data: this.ColorsDataNames || [],
          // nodes: this.DataNames,
          links: this.linksData || [],
        }
      ],
      labelLayout:{
        verticalAlign: 'middle'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: '#fff',
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 7,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        padding: 7,
        borderWidth: 0.2,
        // formatter: '{b} <br/> {c} KWh',
        formatter: function(params: any) {
          let type = "node";
          if (params.dataType === type) {
            var nodeName = params.name;
            var totalValue = 0;
        
            let edgeType = 'edge';
            if (params.dataType === edgeType) {
              var edgeName = params.data.source;
              // console.log(edgeName)
              // Check if the node name and edge name are equal
              if (nodeName === edgeName) {
                // If they are equal, accumulate the value
                totalValue += params.value;
              }
            }
            return null;
          } else {
            let formattedValue = params.value.toLocaleString();
            let displayName = params.name;
            displayName = displayName.replace(">", "&#8594;");
            return displayName + '<br/>' + formattedValue + ' KWh';
          }
        },
        textStyle: {
          fontFamily: 'SharpSans, sans-serif',
          color: '#666',
          fontSize: 15,
          fontWeight: 'bold'
        }
      }
    }
  }

  // google chart
  type = 'Sankey';
  GoogleSankeydata :any[] = [];
  colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
                  '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];
  columnNames = ['From', 'To','Weight'];
  options = {
    sankey: {  
      node: {
        colors: this.colors
      },
      link: {
        colorMode: 'gradient',
        colors: this.colors 
      } 
    },
    tooltip: {
      textStyle: { color: 'blue', fontName: 'SharpSans', fontSize: '14' },
    }
  }
  width = 1050;
  height = 2500;

  charttype = 'Sankey'
  googleChart(){

  }

  



}
