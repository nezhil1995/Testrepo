import { Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, } from '@fortawesome/free-solid-svg-icons';
import { DgCost, PlantNam } from '../Data';
import * as XLSX from 'xlsx-js-style'
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dgcost',
  templateUrl: './dgcost.component.html',
  styleUrls: ['./dgcost.component.css'],
  providers:[DatePipe]
})
export class DgcostComponent implements OnInit, OnChanges {

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
  maxDate = new Date();
  DefaultDate = new Date();

  TableHeight: string = '445px';

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

   TotalCost(cost: number, value:number) {
    if(cost === 0){
      return 0
    }else{
      return cost*value
    }
  }

  ngOnChanges(): void {
    if(this.selected){
      this.form.patchValue(this.selected)
      this.ModalType = 'UPDATE'
    }
    else{
      this.form.reset();
      this.ModalType = 'ADD'
    }
  }

  dropPlantData: PlantNam[] = []
  plants:any
  defaultValue: string = 'SOURCE';

  selectedData: any = null
  selected: any = [];
  DisplayModal=false

  DgCostData : DgCost[] = []

  load = true
  loading = true
  maskLoad:boolean = false

  form:FormGroup;
  Monthform:FormGroup
  ModalType = 'ADD'

  endpoint = 'costdata'
  sourceName = 'DG'

  GetMonthCostData(date:any){
    this.load = true
    let month = this.datepipe.transform(date, 'MM')
    let year = this.datepipe.transform(date, 'yyyy')
    if (month !== null && year !== null) {
      this.GetData(month, year);
    }
  }

  GetData(month:string, year:string){
    this.ApiData.GetCostDataMonth(this.endpoint, this.sourceName, month, year).subscribe(
      response => {
        this.DgCostData = response
        this.load = false
        this.loading = false
      })
  }

  showDialog(){
    this.DisplayModal=true
    this.selectedData = null
    this.ModalType = 'ADD'
    this.DisplayModal = true
    // this.selectedData = value;
    // this.form.patchValue({
    //   dg_id: value.dg_id,
    //   dg_date: value.dg_date,
    //   dg_desc: value.dg_desc,
    //   dg_lit_cons: value.dg_lit_cons,
    // });
  }

  EditModal(data:DgCost){
    this.selectedData = data;
    this.DisplayModal = true;
    this.form.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }

  SavaData(newData:any){
    this.DgCostData.push(newData)
  }

  Update(Update:any){
    const i = this.DgCostData.findIndex((group) => group.dg_id === this.selectedData.dg_id);
    this.DgCostData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
  }

  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService, private datepipe: DatePipe, private Cookie: CookieService) {
    this.form = new FormGroup({
      dg_id: new FormControl(''),
      dg_date: new FormControl('',Validators.required),
      dg_desc: new FormControl('', Validators.required),
      dg_lit_cons: new FormControl('', Validators.required),
      dg_lit_cpl: new FormControl('', Validators.required),
      dg_cost_conform: new FormControl('')
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
      this.ApiData.SaveCostData(this.endpoint, this.sourceName, form).subscribe(
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

  OnUpdate(){
    if(this.selectedData){
      this.maskLoad = true
      this.form.controls['dg_cost_conform'].setValue(true)
      this.ApiData.UpdateCostData(this.endpoint, this.sourceName, this.form.value).subscribe(
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
      message: 'Sure, you want to delete the selected DG cost?',
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
      const id = this.selected[i].dg_id;
      this.ApiData.DeleteCostData(this.endpoint, this.sourceName, id).subscribe(
        () => {
          const index = this.DgCostData.findIndex(j => j.dg_id === id);
          if (index !== -1) {
            this.maskLoad = false
            this.DgCostData.splice(index, 1);
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
    const tableElement = document.getElementById('exportdgtable');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const tabledata = XLSX.utils.table_to_sheet(tableElement);
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(tabledata, {raw: false, dateNF: 'dd/MM/yyyy'});
    for (const cell of sheetData) {
      cell['DATE'] = this.datepipe.transform(cell['DATE'], 'dd-MM-yyyy')
    }
    const numRows = sheetData.length;
    let Heading = [[`DG COST DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 5 }  },
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
    ws['!cols'] = [{ width: 10 }, { width: 20 }, { width: 20 }, { width: 20 }, {width: 20 }, { width: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Dg Cost Details.xlsx`);
    this.maskLoad = false
  }

}
