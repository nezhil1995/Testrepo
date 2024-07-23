import { Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, } from '@fortawesome/free-solid-svg-icons';
import { LpgCost } from '../Data';
import * as XLSX from 'xlsx-js-style'
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-lpgcost',
  templateUrl: './lpgcost.component.html',
  styleUrls: ['./lpgcost.component.css'],
  providers:[DatePipe]
})
export class LpgcostComponent implements OnInit {

  @Input() loginType!:boolean
  @Input() Curr!:any

  check = faCheck
  cross = faXmark
  down = faChevronCircleDown
  reset = faArrowRotateForward
  add = faPlus
  del = faTrash
  edit = faPenToSquare
  public getScreenWidth: any;
  public getScreenHeight: any;

  TableHeight: string = '445px';

  Monthform:FormGroup
  maxDate = new Date();
  DefaultDate = new Date();

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '664px'
    }
    else{
      this.TableHeight = '445px'
    }
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '664px'
    }
    else{
      this.TableHeight = '445px'
    }
    this.form.reset()
    this.GetMonthCostData(this.DefaultDate)
  }

  selectedData: any = null
  selected: any = [];
  DisplayModal=false

  LpgcostData: LpgCost[] = []

  load = true
  loading = true
  maskLoad:boolean = false

  form:FormGroup;
  ModalType = 'ADD'

  endpoint = 'costdata'
  SourceName = 'LPG'
  url = 'localhost:3000'

  GetMonthCostData(date:any){
    this.load = true
    let month = this.datepipe.transform(date, 'MM')
    let year = this.datepipe.transform(date, 'yyyy')
    if (month !== null && year !== null) {
      this.GetData(month, year);
    }
  }

  GetData(month:string, year:string){
    this.ApiData.GetCostDataMonth(this.endpoint, this.SourceName, month, year).subscribe(
      response => {
        this.LpgcostData = response
        // console.log(this.LpgcostData)
        this.load = false
        this.loading = false
      })
  }

  showDialog(){
    this.DisplayModal=true
    this.selectedData = null
    this.ModalType = 'ADD'
  }

  EditModal(data:LpgCost){
    this.selectedData = data;
    this.DisplayModal = true;
    this.form.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }

  SavaData(newData:any){
    this.LpgcostData.push(newData)
  }

  Update(Update:any){
    const i = this.LpgcostData.findIndex((wind) => wind.LPG_id === this.selectedData.LPG_id);
    this.LpgcostData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
  }

  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService, private Cookie: CookieService, private datepipe: DatePipe) {
    this.form = new FormGroup({
      LPG_id: new FormControl(''),
      LPG_date: new FormControl('', Validators.required),
      LPG_kg_cons: new FormControl('', Validators.required),
      LPG_cpkg: new FormControl('', Validators.required),
    });

    this.Monthform = new FormGroup({
      selectMonth: new FormControl('', Validators.required),
    })
  }

  onSubmit() {
    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
    }
    else{
      this.OnSave(this.form.value);
    }
  }

  OnSave(form:any){
    if (this.form.valid) {
      this.maskLoad = true
      this.ApiData.SaveCostData(this.endpoint, this.SourceName, form).subscribe(
        response =>{
          this.maskLoad = false
          this.SavaData(form);
          this.form.reset();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
        },
        error => {
          this.maskLoad = false
          this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
          console.log("Error")
        }
      )
    }
  }

  Idnam = 'id'
  OnUpdate(){
    if(this.selectedData){
      this.maskLoad = true
      this.ApiData.UpdateCostData(this.endpoint, this.SourceName, this.form.value).subscribe(
        update =>{
          this.maskLoad = false
          this.Update(this.form.value);
          this.closeModal();
          this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
        },
        error => {
          this.maskLoad = false
          this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
          console.log("Error")
        }
      )
    }
  }

  deleteselectedRows() {
    this.confirmation.confirm({
      message: 'Sure, you want to delete the selected LPG cost?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.maskLoad = true
        this.DeleteData();
      }
    });
  }

  DeleteData(){
    for (let i = 0; i < this.selected.length; i++)
    {
      const id = this.selected[i].LPG_id;
      this.ApiData.DeleteCostData(this.endpoint, this.SourceName, id).subscribe(
        () => {
          const index = this.LpgcostData.findIndex(j => j.LPG_id === id);
          if (index !== -1) {
            this.maskLoad = false
            this.LpgcostData.splice(index, 1);
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
          }
        },
        error => {
          this.maskLoad = false
          this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
          console.log("Error");
        }
      );
    }
    this.selected = [];
  }

  rowHeight(value:number){
    let heightarr = []
    for(let ind=0; ind<value; ind++){
      heightarr.push({ hpt : 18})
    }
    return heightarr
  }

  exportExcel(){
    this.maskLoad = true
    const tableElement = document.getElementById('exportlpgtable');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const tabledata = XLSX.utils.table_to_sheet(tableElement);
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(tabledata, {raw: false, dateNF: 'dd/MM/yyyy'});
    for (const cell of sheetData) {
      cell['DATE'] = this.datepipe.transform(cell['DATE'], 'dd-MM-yyyy')
    }
    const numRows = sheetData.length;
    let Heading = [[`LPG COST DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 }  },
    ];
    const ws = XLSX.utils.aoa_to_sheet([]);
    ws["!merges"] = merge;
    XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'B2'} );
    XLSX.utils.sheet_add_json(ws, sheetData, { origin: 'B4', skipHeader: false} );
    
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
    ws['!rows']= this.rowHeight((numRows + 1) * 5)
    ws['!cols'] = [{ width: 10 }, { width: 20 }, { width: 20 }, { width: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `LPG Cost Details.xlsx`);
    this.maskLoad = false
  }

}
