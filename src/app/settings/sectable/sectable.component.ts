import { Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faArrowRotateForward, faComputer, faPaintRoller, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faPenToSquare,} from '@fortawesome/free-solid-svg-icons';
import { Sectab } from '../Data';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from 'xlsx-js-style'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sectable',
  templateUrl: './sectable.component.html',
  styleUrls: ['./sectable.component.css'],
  providers:[DatePipe]
})
export class SectableComponent implements OnInit, OnChanges {

  @Input() loginType!:boolean

  plug = faComputer
  paint = faPaintBrush

  edit = faPenToSquare
  add = faPlus
  check = faCheck
  cross = faXmark
  reset = faArrowRotateForward

  SecData: Sectab[] = []
  PsSecData: Sectab[] = []
  form!:FormGroup;
  Psform:FormGroup

  selectedData: any = null
  PsselectedData: any = null
  selected: any = [];

  DisplayModal = false
  PsDisplayModal = false
  ModalType = 'ADD'
  PsModalType = 'ADD'

  loading = false
  load = true
  psload = true
  maskLoad:boolean = false

  MonthSECform:FormGroup
  PsMonthSECform:FormGroup
  maxDate = new Date();
  DefaultDate = new Date();
  psDefaultDate = new Date();

  constructor(private ApiData: SettingsService, private messageService: MessageService, private datepipe: DatePipe, private route: ActivatedRoute, private Cookie: CookieService){
    this.form = new FormGroup({
      sec_id: new FormControl(),
      sec_material: new FormControl('', Validators.required),
      sec_date:  new FormControl(),
      sec_energy: new FormControl(),
      sec_value: new FormControl(),
      sec_conform: new FormControl(),
      sec_group: new FormControl(),
    });

    this.Psform = new FormGroup({
      sec_id: new FormControl(),
      sec_material: new FormControl('', Validators.required),
      sec_date:  new FormControl(),
      sec_energy: new FormControl(),
      sec_value: new FormControl(),
      sec_conform: new FormControl(),
      sec_group: new FormControl(),
    });

    this.MonthSECform = new FormGroup({
      selectMonth: new FormControl('', Validators.required),
    })

    this.PsMonthSECform = new FormGroup({
      selectMonth: new FormControl('', Validators.required),
    })
  }

  public getScreenWidth: any;
  public getScreenHeight: any;

  TableHeight: string = '455px';

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '655px'
    }
    else{
      this.TableHeight = '455px'
    }
  }

  ngOnInit(): void{
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '655px'
    }
    else{
      this.TableHeight = '455px'
    }
    this.GetMonthSECData(this.DefaultDate)
    // this.PsGetMonthSECData(this.psDefaultDate)
  }

  ngOnChanges(): void{

  }

  endpoint = 'sec'

  private sub!: Subscription;

  GetMonthSECData(date:any){
    this.load = true
    let month = this.datepipe.transform(date, 'MM')
    let year = this.datepipe.transform(date, 'yyyy')
    if (month !== null && year !== null) {
      this.getData(month, year);
    }
  }

  PsGetMonthSECData(date:any){
    this.psload = true
    let month = this.datepipe.transform(date, 'MM')
    let year = this.datepipe.transform(date, 'yyyy')
    if (month !== null && year !== null) {
      this.psgetData(month, year);
    }
  }

  ResSecdata:any

  getData(month:string, year:string){
    this.ApiData.GetSECMonthdata(this.endpoint, month, year).subscribe(
      response =>{
        this.ResSecdata = response
        this.SecData = this.ResSecdata
        this.sub = this.route.queryParams.subscribe(params => {
          this.loginType = (params['isAdmin']==='true' && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg');
        });
        this.load = false
      }
    )
  }

  psgetData(month:string, year:string){
    this.ApiData.GetSECMonthdata(this.endpoint, month, year).subscribe(
      response =>{
        this.ResSecdata = response
        this.PsSecData = this.ResSecdata['PAINTSHOP']
        this.sub = this.route.queryParams.subscribe(params => {
          this.loginType = (params['isAdmin']==='true' && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg');
        });
        this.psload = false
      }
    )
  }

  showModal(data:Sectab){
    this.DisplayModal=true
    this.selectedData = data
    this.form.patchValue({
      sec_id: data.sec_id,
      sec_date: data.sec_date,
      sec_energy: Number(data.sec_energy),
      sec_material: data.sec_material,
      sec_group: data.sec_group
    });
    this.ModalType = 'ADD'
  }

  PsshowModal(data:Sectab){
    console.log(data)
    this.PsDisplayModal=true
    this.PsselectedData = data
    this.Psform.patchValue({
      sec_id: data.sec_id,
      sec_date: data.sec_date,
      sec_energy: Number(data.sec_energy),
      sec_material: data.sec_material,
      sec_group: data.sec_group
    });
    this.PsModalType = 'ADD'
  }

  EditModal(data:Sectab){
    this.selectedData = data;
    this.DisplayModal = true;
    this.form.patchValue({
      sec_id: data.sec_id,
      sec_date: data.sec_date,
      sec_energy: Number(data.sec_energy),
      sec_material: data.sec_material,
      sec_group: data.sec_group
    });
    this.ModalType = 'UPDATE'
  }

  PsEditModal(data:Sectab){
    console.log(data)
    this.PsselectedData = data;
    this.PsDisplayModal = true;
    this.Psform.patchValue({
      sec_id: data.sec_id,
      sec_date: data.sec_date,
      sec_energy: Number(data.sec_energy),
      sec_material: data.sec_material,
      sec_group: data.sec_group
    });
    this.PsModalType = 'UPDATE'
  }

  Update(Update:any){
    const i = this.SecData.findIndex((sec) => sec.sec_id === this.selectedData.sec_id);
    this.SecData[i] = Update;
  }

  PsUpdate(Update:any){
    const i = this.PsSecData.findIndex((sec) => sec.sec_id === this.PsselectedData.sec_id);
    this.PsSecData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
  }

  psresetFrom(){
    this.Psform.reset();
  }

  pscloseModal(){
    this.Psform.reset();
    this.PsDisplayModal=false
  }

  onSubmit() {
    const secValue = Number(this.form.value.sec_energy) / Number(this.form.value.sec_material);
    this.form.patchValue({
      sec_value: Number(secValue.toFixed(2)),
      sec_conform: 1
    });

    if(this.ModalType==='UPDATE'){
      this.OnUpdate(this.form.value, 'img');
    }
    else{
      this.OnSave(this.form.value, 'img');
    }
  }

  PsonSubmit() {
    console.log('working ps')
    const secValue = Number(this.Psform.value.sec_energy) / Number(this.Psform.value.sec_material);
    this.Psform.patchValue({
      sec_value: Number(secValue.toFixed(2)),
      sec_conform: 1
    });

    if(this.PsModalType==='UPDATE'){
      this.OnUpdate(this.Psform.value, 'ps');
    }
    else{
      this.OnSave(this.Psform.value, 'ps');
    }
  }

  OnSave(Form:any, type:string){
    if(this.selectedData){
      // console.log(this.form.value)
      this.maskLoad = true
      this.ApiData.SaveData(this.endpoint, Form).subscribe(
        update =>{
          this.maskLoad = false
          this.Update(Form);
          if(type=='img'){
            this.Update(Form);
            this.closeModal();
          }
          else{
            this.PsUpdate(Form);
            this.pscloseModal();
          }
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

  OnUpdate(Form:any, type:string){
    if(this.selectedData){
      this.maskLoad = true
      this.ApiData.SaveData(this.endpoint, Form).subscribe(
        update =>{
          this.maskLoad = false
          if(type=='img'){
            this.Update(Form);
            this.closeModal();
          }
          else{
            this.PsUpdate(Form);
            this.pscloseModal();
          }
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

  FormateDataString(value:any): any{
    const formateString = this.datepipe.transform(value, 'dd-MM-yyyy')
    const data = formateString
    return formateString
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
    const tableElement = document.getElementById('secexptab');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const tabledata = XLSX.utils.table_to_sheet(tableElement)
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(tabledata, {raw: false, dateNF: 'dd/MM/yyyy'});
    for (const cell of sheetData) {
      cell['DATE'] = this.datepipe.transform(cell['DATE'], 'dd-MM-yyyy')
    }
    const numRows = sheetData.length;
    let Heading = [[`SEC DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 4 }  }
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
    XLSX.utils.table_to_sheet(tableElement)['A2']['t'] = 's'
    ws['!rows']= this.rowHeight((numRows + 1) * 5)
    ws['!cols'] = [{ width: 10 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `SEC Details.xlsx`);
    this.maskLoad = false
  }


}
