import { Component, OnInit } from '@angular/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RCorbonService } from '../r-corbon.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Rcarbon } from '../Data';
import * as XLSXStyle from 'xlsx-js-style';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [DatePipe]
})
export class SummaryComponent implements OnInit {

  file = faFileExcel
  date!: Date[];
  total: number = 0
  seleter: any[] = ['Month Basis', 'Year Basis']
  DefaultType: string = 'Month Basis'

  formMonth:FormGroup;
  formYear:FormGroup;
  formType:FormGroup

  maxDate = new Date();
  DefaultDate = new Date

  ngOnInit(): void {
    this.UnitName = this.Cookie.get('plantname')
    this.Location = this.Cookie.get('location')
    this.total = 0
    this.GetMonthTableData(this.DefaultDate)
  }

  constructor( private datePipe: DatePipe, private ApiData: RCorbonService, private Cookie: CookieService)
  {
    this.formType = new FormGroup({
      selectedType: new FormControl('', Validators.required),
    })

    this.formMonth = new FormGroup({
      selectMonth: new FormControl('',Validators.required)
    });

    this.formYear = new FormGroup({
      selectYear: new FormControl('',Validators.required)
    });
  }

  load = false
  tablevisible = false
  BaseString = ''
  MonthTypeData:any
  month!: any;
  columns!:any
  footerData!:any
  totalSalesAmount: number = 0
  carbonDashData:any
  CarbonData: Rcarbon[] = []
  tableData!:any
  UnitName = ''
  Location = ''

  GetMonthTableData(value:any){
    this.load = true
    this.tablevisible = false
    var name = value
    var Month = this.datePipe.transform(name, 'M/yyyy');
    var MonthNam = this.datePipe.transform(name, 'MMMM YYYY');
    var [month, Year] = Month?.split('/') ?? [];
    this.BaseString = 'MONTH'
    this.month = `${MonthNam?.toUpperCase()}`;
    const FormData ={
      Type : 'Month Basis',
      Month: month,
      Year: Year
    }
    // console.log(FormData)
    this.CarbonData = []
    this.formYear.controls['selectYear']?.setValue(null)
    this.ApiData.PostData('rcarbonsummary', FormData).subscribe(
      res => {
        this.CarbonData = res
        let Length = this.CarbonData.length
        let sum = 0
        this.total = 0
        for (let i = 0; i < Length; i++) {
          let s = parseFloat(this.CarbonData[i].emission);
          sum += s
        }
        this.total = sum
        this.load = false
        this.tablevisible = true
      }
    )
  }

  GetYearTableData(value:string){
    if(value){
      this.load = true
      this.tablevisible = false
      const year = this.datePipe.transform(this.formYear.get('selectYear')?.value, 'yyyy');
      this.BaseString = 'YEAR'
      this.month = `${year}`;
      this.formYear.get('selectYear')?.setValue(year)
      const FormData ={
        Type : this.formType.controls['selectedType'].value,
        Month: null,
        Year: year
      }
      // console.log(FormData)
      this.CarbonData = []
      this.ApiData.PostData('rcarbonsummary', FormData).subscribe(
        res => {
          this.CarbonData = res
          let Length = this.CarbonData.length
          this.total = 0
          let sum = 0
          for (let i = 0; i < Length; i++) {
            let s = parseFloat(this.CarbonData[i].emission);
            sum += s
          }
          this.total = sum
          this.load = false
          this.tablevisible = true
        }
      )
    }
  }

  excelExport(): void {
    // let tabledata = this.CarbonData;
    const sheetname = 'sheet1';
    // const sheetdata = tabledata;
    const wb = XLSXStyle.utils.book_new();
    // const ws = XLSXStyle.utils.json_to_sheet([]);
    // XLSX.utils.sheet_add_aoa(ws, this.columns, { origin:'A0' })
    // XLSXStyle.utils.sheet_add_json(ws, sheetdata, { origin:'A0' ,skipHeader: true,  });
    const sheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('dt'))
    const sheetData = XLSX.utils.sheet_to_json(sheet);
    const numRows = sheetData.length;

    for (var i in sheet) {
      if (typeof sheet[i] != 'object') continue;
      let cell = XLSXStyle.utils.decode_cell(i);
      // header
      if(cell.r === 0){
        sheet[i].s = {
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
            bold:true,
            color: { rgb: "FFFFFF" },
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
            bold:false,
            color: { rgb: "00000" },
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
      // footer
      if(cell.r === numRows) {
        sheet[i].s = {
          font: {
            name: 'arial',
            bold:true,
            color: { rgb: "00000" },
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
      { width: 10 },
      { width: 60 },
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
    ];
    sheet['!rows']=[
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 }
    ]

    XLSXStyle.utils.book_append_sheet(wb, sheet, sheetname);
    const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buffer = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(data, `Carbon-Emision-${this.month}.xlsx`);
  }


  newExcelReport(){
    // Table data and styles
    const tableElement = document.getElementById('dt');
    const wb = XLSX.utils.book_new();
    const sheetname = 'sheet1';
    const heading = [[`${this.UnitName} ${this.Location} - CARBON EMISSION FOR THE ${this.BaseString} ${this.month}`]];
    const footer = [['Total Emission']]
    const ws = XLSX.utils.aoa_to_sheet([]);
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement));
    ws['!merges'] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 }  },
      { s: { r: 12, c: 0 }, e: { r: 12, c: 6 } },
    ];// Merge header cells


    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A2'} );
    XLSX.utils.sheet_add_json(ws, sheetData, { origin: 'A3', skipHeader: false} );

    // XLSX.utils.sheet_add_aoa(ws, footer, { origin: 'A14'} );

    for (var i in ws) {

      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      // header
      if (cell.r == 1 || cell.r == 3) {
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
        },
        ws[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'da2127' },
          bgColor: { rgb: 'da2127' },
        };
      }

      // body
      if(cell.r >= 4){
        ws[i].s = {
          font: {
            name: 'arial',
            bold:false,
            color: { rgb: "000000" },
            sz:9
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
      }
    }

     let footerStyle = {
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
      fill:{
        patternType: 'solid',
        fgColor: { rgb: 'da2127' },
        bgColor: { rgb: 'da2127' },
      }
    }

    ws['A13'].s = footerStyle
    ws['H13'].s = footerStyle

    // console.log(ws)

    ws['!cols'] = [
      { width: 10 },
      { width: 60 },
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
    ];
    ws['!rows']=[
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 },
      { hpt : 20 }
    ]

    delete (ws['A3'])
    delete (ws['B3'])
    delete (ws['C3'])
    delete (ws['D3'])
    delete (ws['E3'])
    delete (ws['F3'])
    delete (ws['G3'])
    delete (ws['H3'])
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Carbon-Emision-${this.month}.xlsx`);
  }

}
