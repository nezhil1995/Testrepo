import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
import { Source } from '../../settings/Data'
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx-js-style';
import * as XLSXStyle from 'xlsx-js-style';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as FileSaver from 'file-saver';
import { Currency } from '../../CurrencyData';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface ModifiedSheetDataRow {
  Date: string;
  [hour: string]: number | string;
}

@Component({
  selector: 'app-excesspower',
  templateUrl: './excesspower.component.html',
  styleUrls: ['./excesspower.component.css'],
  providers: [DatePipe],
})


export class ExcesspowerComponent implements OnInit{

  meter = faFileExcel
  load: boolean = true
  Tabload: boolean = true
  form!:FormGroup
  metersrc: any
  date!: Date[];
  maxDate = new Date();
  TableData: any[] = []
  HourlyData:any
  title = ''
  Data:any
  nodata = 'No Data'
  ngOnInit(): void {
    this.GetData()
  }

  endpointScr = 'sourcemanagement'
  dropSourceData: Source[] = []

  GetData(){
    this.ApiData.getData(this.endpointScr).subscribe(
      res => {
        this.load = false
        this.dropSourceData = res
        this.metersrc = this.dropSourceData.map((data) => ({ name: data.assourcename }));
      })
  }

  constructor(private ApiData: AnalyticsService, private datePipe: DatePipe, private route: ActivatedRoute ) {

    this.form = new FormGroup({
      selectMonth: new FormControl('',Validators.required),
      srcname: new FormControl('',Validators.required),
    })

  }

  GetCurrencyData(value:string):any{
    const findsymbol = Currency.find((item)=> item.code === value)
    return findsymbol?.symbol 
  }

  startDate!: Date;
  endDate!: Date;

  endpoint = 'excesspower'
  vis = false
  selectMonth:any = ''
  CurrencyType = ''
  private sub!: Subscription;

  onSubmit(){
    if (this.form.valid) {
      this.Tabload = true
      this.vis = true
      const selectedMonth = this.form.value.selectMonth;
      const MonthName = this.datePipe.transform(selectedMonth, 'MMM-YYYY');
      this.selectMonth = MonthName
      this.title = this.form.get('srcname')?.value
      const currentDate = new Date();
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();

      this.startDate = new Date(year, month, 1);
      this.endDate = new Date(year, month + 1, 0);

      if (selectedMonth.getFullYear() === currentDate.getFullYear() && selectedMonth.getMonth() === currentDate.getMonth()) {
        this.endDate = currentDate;
      } else {
        this.endDate = new Date(year, month + 1, 0);
      }

      const formattedFirstDay = this.datePipe.transform(this.startDate , 'yyyy-MM-dd');
      const formattedLastDay = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

      let postData = {
        fromdate: formattedFirstDay,
        todate: formattedLastDay,
        srcname: this.form.get('srcname')?.value
      }

      this.ApiData.postData(this.endpoint, postData).subscribe(
        res =>{
          this.HourlyData = []
          this.Data = res
          this.TableData = this.Data.excess_kva
          this.HourlyData = this.Data.kva_by_date
          this.Tabload = false
          if(this.form.get('srcname')?.value === 'Transformer1'){
            this.calculatedCost(this.Data.percentage, this.Data.KVAcost, this.Data.KVApenality, this.Data.AttainedKva)
          }
          else{
            this.CostofMonth = 0
          }
          this.sub = this.route.queryParams.subscribe(params => {
            this.CurrencyType = this.GetCurrencyData(params['Currency']);
          });
      })

      // this.ApiData.postDataTest(postData).subscribe(
      //   res=>{
      //     this.Tabload = false
      //     this.TableData = res
      // })

    }

  }

  CurrentSourcename = ''

  ToModify(Value:string){
    this.CurrentSourcename = Value
  }

  CostofMonth = 0
  AttKva = 0
  per:number = 0
  KVACosting = 0
  Pencost = 0
  ExcessKVA = 0

  calculatedCost(percentage: number, kvacost:number, penalatyKvacost:number, AttainedKva:number){
    let Data = this.TableData
    let excessKvaAr = []
    for(let i=0; i<Data.length; i++){
      if(Data[i].consumedcapacity > AttainedKva){
        excessKvaAr.push(Data[i].consumedcapacity)
      }
    }
    let excessKvaofMonth = 0
    if(excessKvaAr.length == 1){
      excessKvaofMonth = excessKvaAr[0]
    }
    else if(excessKvaAr.length > 1){
      excessKvaofMonth = Math.max(...excessKvaAr);
    }
    else{
      excessKvaofMonth = 0
    }

    this.ExcessKVA = excessKvaofMonth
    
    let Calper = AttainedKva * (percentage/100)
    let penaltcost = penalatyKvacost * (excessKvaofMonth - AttainedKva)

    this.AttKva = AttainedKva
    this.per = percentage
    this.KVACosting = kvacost
    this.Pencost = penalatyKvacost
 
    if(excessKvaofMonth==0){
      this.CostofMonth = Calper * kvacost
    }
    else{
      this.CostofMonth = (Calper * kvacost) + penaltcost
    }
    
  }

  DisplayModal = false

  showFormulaDialog(){
    this.DisplayModal = true
  }

  rowHeight(value:number){
    let heightarr = []
    for(let ind=0; ind<value; ind++){
      heightarr.push({ hpt : 18})
    }
    return heightarr
  }

  formatDate(date: Date): string {
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

  HourlyReport(){
    const JsonData: ModifiedSheetDataRow[] = this.HourlyData.map((row: any) => {
      const modifiedRow: ModifiedSheetDataRow = {
          Date: this.formatDate(new Date(row['Date'])), // Assuming 'Date' is a date string in the format 'YYYY-MM-DD'
      };
      let hour = 6;
      for (let i = 1; i <= 24; i++) {
          const hourString = `${hour % 24}:00`;

          modifiedRow[hourString] = row[`h${i}`];

          hour = (hour + 1) % 24;
      }
      return modifiedRow;
    });

    const sheetname = 'sheet1';
    const wb = XLSXStyle.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    let Heading = [[`Hourly Data for KVA Demand for ${this.selectMonth}`]];
    const merge = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 }  },
    ];

    XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A2'} );
    ws["!merges"] = merge;

    XLSX.utils.sheet_add_json(ws,JsonData, {origin: 'A4' , skipHeader: false });


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
    }
  
      ws['!cols'] = [
        { width: 15 }
      ];


    XLSXStyle.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Excess Power for Hourly.xlsx`)
  }
  

  ExportData(){
    const sheetname = 'sheet1';
    const wb = XLSXStyle.utils.book_new();
    const sheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('excessdt'))
    
    const sheetData = XLSX.utils.sheet_to_json(sheet);
    const numRows = sheetData.length;


    for (var i in sheet) {
      if (typeof sheet[i] != 'object') continue;
      let cell = XLSXStyle.utils.decode_cell(i);
      // console.log(sheet[i])
      // header
      if(cell.r === 0){
        sheet[i].s = {
          font: {
            name: 'arial',
            color: { rgb: "FFFFFF" },
            bold:true,
            sz:10
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border: {
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
          },
        };
        sheet[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'da2127' },
          bgColor: { rgb: 'da2127' },
        };
      }
      if(cell.r === 1){
        sheet[i].s = {
          font: {
            name: 'arial',
            color: { rgb: "FFFFFF" },
            bold:true,
            sz:10
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border: {
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
          },
          
        };
        sheet[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'da2127' },
          bgColor: { rgb: 'da2127' },
        };
      }
      // body
      if (cell.r >= 2) {
        sheet[i].s = {
          font: {
            name: 'arial',
            color: { rgb: "000000" },
            sz:9
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border: {
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
          },
        };
      }
    }
    sheet['!cols'] = [
      { width: 15 },
      { width: 28 },
      { width: 26 },
      { width: 26 },
      { width: 25 },
    ];
    sheet['!rows']= this.rowHeight(numRows + 1)

    XLSXStyle.utils.book_append_sheet(wb, sheet, sheetname);
    XLSX.writeFile(wb, `Excess Power for ${this.title}-${this.selectMonth}.xlsx`)
    // const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'binary' });
    // const buffer = new ArrayBuffer(wbout.length);
    // const view = new Uint8Array(buffer);
    // for (let i = 0; i < wbout.length; i++) {
    //   view[i] = wbout.charCodeAt(i) & 0xff;
    // }
    // const data: Blob = new Blob([buffer], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // });
    // FileSaver.saveAs(data, `Excess Power for ${this.title}-${this.selectMonth}`);

  }



  exportData(){
    let tabledata = this.Data
    const sheetname = 'sheet1';
    let Heading =  [['EXCESS POWER DEMAND DATA']]
    const sheetdata = tabledata

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'D2'} );

    //Starthing in the next row to avoid overriding on header names
    XLSX.utils.sheet_add_json(ws,sheetdata, {origin: 'C4' , skipHeader: false })

    // XLSX.utils.sheet_add_json(ws,sheetdata, {origin: 'C4' , skipHeader: false });

    for (var i in ws) {
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      ws[i].s = {
        font: {
          italic: true
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
            bold:true,
            color:'ff0000'
          }
        }
      }

      if (cell.r == 3) {
        ws[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'ADD8E6' },
          bgColor: { rgb: 'ADD8E6' },
        };
      }
    }

    ws['!cols']=[]
    ws['!cols'][2]= { width: 20}
    ws['!cols'][3]= { width: 20}
    ws['!cols'][4]= { width: 30}
    ws['!cols'][5]= { width: 30}
    ws['!cols'][6]= { width: 30}
    ws['!cols'][7]= { width: 30}

    XLSX.utils.book_append_sheet(wb,ws, sheetname);
    XLSX.writeFile(wb, 'Excess Power Demand_data.xlsx')
  }

}
