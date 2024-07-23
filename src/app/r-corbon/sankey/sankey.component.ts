import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as am5 from '@amcharts/amcharts5';
import * as am5flow from '@amcharts/amcharts5/flow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import * as Highcharts from 'highcharts';
import Sankey from 'highcharts/modules/sankey';
import { RCorbonService } from '../r-corbon.service';
Sankey(Highcharts);

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
  maxDate = new Date();
  DefaultDate = new Date()
  formType: FormGroup
  formMonth: FormGroup
  formYear: FormGroup
  formDate: FormGroup
  TotalEmmConsume:number = 0

  isCurrentDate(date: Date): boolean {
    const currentDate = new Date();
    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      date.toDateString() === currentDate.toDateString()
    );
  }

  ngOnInit() {
    this.GetdateData(this.DefaultDate)
    // this.getEchartData()
  }

  constructor(private ApiData: RCorbonService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private datePipe: DatePipe) {

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
    this.linksData = []
    let Totalconsume = 0
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
      if(linksData[i].source === 'Total Emission'){
        Totalconsume += Number(linksData[i].value)
      }
      this.linksData.push({
        source: linksData[i].source,
        target: linksData[i].target,
        value: Number(linksData[i].value)
      })
    }
    this.TotalEmmConsume = Totalconsume
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
      this.ApiData.PostData(this.endpoint, FormData).subscribe(
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
      this.ApiData.PostData(this.endpoint, FormData).subscribe(
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
      this.ApiData.PostData(this.endpoint, FormData).subscribe(
        res =>{
          this.sankeyPostData = null
          this.DataFeedEchart(res)
          this.load = false
        }
      )
    }
  }

  // private root!: am5.Root;
  endpoint = 'sankeycarbon'
  SankeyChart: any
  load: boolean = true

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

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
        let Totalconsume = 0
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
          if(linksData[i].source === 'Total Emission'){
            Totalconsume += Number(linksData[i].value)
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
      const randomColor = '#6ECB63';
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
      textStyle:{
        fontFamily: 'SharpSans, sans-serif',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0000',
      },
      title: {
        subtext: `Total Emission: ${(this.TotalEmmConsume).toLocaleString()} Kg CO₂ e`,
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
            return displayName + '<br/>' + formattedValue + ' Kg CO<sub>2</sub> e';
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

  // highcharts

  Highcharts: typeof Highcharts = Highcharts;
  HCchartOptions!: Highcharts.Options

  getHCData(){
    this.ApiData.getData(this.endpoint).subscribe(
      (res: any) => {
        this.SankeyChart = res
        let linksData = this.SankeyChart.link
        this.linksData = []
        for(let i = 0; i < linksData.length; i++){
          if(linksData[i].value===null){
            linksData[i].value = 0
          }
          else{
            var tempValue = linksData[i].value
            linksData[i].value = Number(tempValue).toFixed(2)
          }
          let sankeyOrderArr = [linksData[i].source, linksData[i].target, Number(linksData[i].value)]
          this.linksData.push(sankeyOrderArr)
        }
        // console.log(this.linksData)
        this.HighSankyChart()
        this.load = false
    })
  }

  pureSankeyData = [this.linksData]

  HighSankyChart(){

    this.HCchartOptions = {
      title: {
        text: ''
      },
      accessibility: {
        point: {
          valueDescriptionFormat: '{index}. {point.from} to {point.to} <br> {point.weight} kWh'
        }
      },
      series: [{
        keys: ['from', 'to', 'weight'],
        data: this.linksData,
        type: 'sankey',
    }]

    };
  }


    // ngAfterViewInit() {
  //   // Chart code goes in here
  //   this.browserOnly(() => {
  //     let root = am5.Root.new("chartdiv");
  //     root.setThemes([am5themes_Animated.new(root)]);
  //     root.autoResize = true
  //     let series = root.container.children.push(am5flow.Sankey.new(root,{
  //       sourceIdField: "from",
  //       targetIdField: "to",
  //       valueField: "value",
  //       paddingRight: 150,
  //       nodeWidth: 10,
  //       nodePadding: 15,
        
  //     }));

  //     this.ApiData.getData(this.endpoint).subscribe((res: any) => {
  //       this.linksChart = res.links
  //       this.load=false
  //       const data = []

  //       for(let i=0; i<this.linksChart.length; i++){
  //         let value = Number(this.linksChart[i].value)
  //         data.push(
  //           { from: this.linksChart[i].source, to: this.linksChart[i].target, value: value }
  //         )
          
  //       }
  //       series.data.setAll([] = data)
  //       // console.log(data)

  //       // series.data.setAll([
  //       //   {from: 'Total Consumption', to: 'DG', value: 785},
  //       //   {from: 'Total Consumption', to: 'Transformer1', value: 20720},
  //       //   {from: 'Total Consumption', to: 'Transformer1', value: 20744},
  //       //   ]);

        

  //       series.appear(1000, 100);
  //     });
  //   });
  // }

  // ngOnDestroy() {
  //   this.browserOnly(() => {
  //     if (this.root) {
  //       this.root.dispose();
  //     }
  //   });
  // }

}
