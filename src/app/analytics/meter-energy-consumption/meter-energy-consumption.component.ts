import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx-js-style';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-meter-energy-consumption',
  templateUrl: './meter-energy-consumption.component.html',
  styleUrls: ['./meter-energy-consumption.component.css'],
  providers:[DatePipe]
})
export class MeterEnergyConsumptionComponent implements OnInit {

  maxDate = new Date();
  DefaultDate = new Date()
  EnrConsumptionData:any[] = []
  header:any
  load: boolean = true
  meter = faFileExcel

  form: FormGroup

  TableHeight: string = '465px';
  public getScreenWidth: any;
  public getScreenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '685px'
    }
    else{
      this.TableHeight = '475px'
    }
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '685px'
    }
    else{
      this.TableHeight = '475px'
    }
  }

  constructor(private ApiData: AnalyticsService, private datepipe: DatePipe) {
    this.form = new FormGroup({
      dateRange: new FormControl('', Validators.required),
      fromdate: new FormControl('', Validators.required),
      todate: new FormControl('', Validators.required)
    })
  }

  SelectedMonth :any
  rangeDates!: Date[];
  @ViewChild('calendar') private calendar: any;

  onDateRangeSelect() {
    const selectedDates = this.rangeDates;
    if (selectedDates.length === 2) {
      const [fromDate, toDate] = selectedDates;
      const fromDateFormatted = this.formatDate(fromDate);
      const toDateFormatted = this.formatDate(toDate);
      this.form.patchValue({
        fromdate: fromDateFormatted,
        todate: toDateFormatted,
      });
      if(this.rangeDates[1] !== null){
        this.calendar.overlayVisible=false;
      }
      
      this.GetData(this.form.value)
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

  OnSubmit(){
    
  }

  GetData(val:any){
    if(this.form.valid){
      this.load = true
      this.ApiData.postData('metercons', val).subscribe(
        res => {
          this.EnrConsumptionData = res.Data
          this.header = res.Date
          if(this.header.length >= 10){
            if(this.header.length >= 15){
              let width = this.header.length * 14
              this.tableWidth = `${width.toString()}%`
            }
            else{
              let width = this.header.length * 12
              this.tableWidth = `${width.toString()}%`
            }
          }
          else{
            this.tableWidth = "100%"
          }
          
          this.load = false
        }
      )
    }
  }

  tableWidth = '100%'

  exportData() {
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    // Header data and styles
    const heading = [[`ENERGY CONSUMPTION REPORT`]];
    const headingStyle = {
      font: {
        name: 'arial',
        color: { rgb: 'FFFFFF' },
        bold: true,
        sz: 10
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
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'da2127' },
        bgColor: { rgb: 'da2127' },
      }
    };
  
    // Table data and styles
    const tableElement = document.getElementById('dt');
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement));
    // Iterate over sheetData and format date strings
    for (let i = 0; i < sheetData.length; i++) {
      const rowData = sheetData[i];
      const keys = Object.keys(rowData);
      // Iterate through keys of each row
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        // Check if the key is a date string
        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(key)) {
          const dateParts = key.split('/');
          const formattedDate = `${dateParts[1]}/${dateParts[0]}/20${dateParts[2]}`;
          rowData[formattedDate] = rowData[key]; // Add a new key with formatted date
          delete rowData[key]; // Remove the old key
        }
      }
    }
    // Create worksheet
    
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws['!merges'] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 }  },
    ];// Merge header cells
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A2'} );
    XLSX.utils.sheet_add_json(ws, sheetData, { origin: 'A4', skipHeader: false });
  
    // Apply styles to header
    ws['A2'].s = headingStyle;

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
      const columnWidth = 12;
      ws['!cols'] = [{ width: 20 }];
      const numColumns = Object.keys(sheetData[0]).length; // Assuming all rows have the same number of columns
      for (let col = 0; col < numColumns-1; col++) {
          ws['!cols'].push({ width: columnWidth });
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `ENERGY CONSUMPTION REPORT.xlsx`);
  }
  
  

}
