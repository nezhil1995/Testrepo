import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { PlantNam } from '../Data';
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from 'xlsx-js-style';

interface plant {
  name: string;
}

@Component({
  selector: 'app-plantdialog',
  templateUrl: './plantdialog.component.html',
  styleUrls: ['./plantdialog.component.css'],
  providers:[DatePipe]
})
export class PlantdialogComponent implements OnInit, OnChanges {

  @Input() loginType!:boolean

  check = faCheck
  cross = faXmark
  down = faChevronCircleDown
  reset = faArrowRotateForward
  add = faPlus
  del = faTrash
  edit = faPenToSquare
  user = faUserPen
  met = faComputer
  ger = faGears
  warh = faWarehouse
  ses = faBusinessTime
  gro = faLayerGroup

  plantData: PlantNam[] = []
  date:any

  selectedData: any = null
  selected: any = [];

  defaultValue: string = 'SOURCE';

  DisplayModal = false
  load = true
  loading = false;
  maskLoad:boolean = false

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
  }

  public getScreenWidth: any;
  public getScreenHeight: any;

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
    this.GetData()
  }

  plants:any[] = []
  endpoint = 'generalconfig'
  CodeEndpoint='gencode'

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      response => {
        this.plantData = response
        this.load=false
      }
    )
  }

  form:FormGroup;
  ModalType = 'ADD'

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

  showDialog(){
    this.DisplayModal=true
    this.selectedData = null
    this.ModalType = 'ADD'
    this.getCurrentDate()
    // this.form.controls['ttlastupdate'].setValue(this.date)
    this.maskLoad = true
    this.ApiData.getData(this.CodeEndpoint).subscribe(
      res => {
        this.maskLoad = false
        this.defaultValue = res.ttcode
        this.plants = res.ttplant
      },
      error => {
        this.maskLoad = false
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Get', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    )
  }

  EditModal(data:PlantNam){
    this.selectedData = data;
    this.DisplayModal = true;
    console.log(data)
    this.form.patchValue(this.selectedData)
    const ttlastupdate = typeof data.ttlastupdate === 'string' ? new Date(data.ttlastupdate) : data.ttlastupdate;
    if (ttlastupdate instanceof Date && !isNaN(ttlastupdate.getTime())) {
      this.form.controls['ttlastupdate'].setValue(ttlastupdate.toISOString().slice(0, 10));
    }
    this.ModalType = 'UPDATE'
  }

  SavaData(newData:any){
    this.plantData.push(newData)
  }

  Update(Update:any){
    const i = this.plantData.findIndex((plantnam) => plantnam.ttcode === this.selectedData.ttcode);
    this.plantData[i] = Update;
  }


  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService, private Cookie: CookieService, private datepipe: DatePipe) {
    this.form = new FormGroup({
      ttid: new FormControl(null),
      ttplntname: new FormControl('', Validators.required),
      ttdaystarttime: new FormControl('', Validators.required),
      tts1time: new FormControl('', Validators.required),
      tts2time: new FormControl('', Validators.required),
      tts3time: new FormControl('', Validators.required),
      ttlastupdate: new FormControl('', Validators.required),
      ttcode: new FormControl('', Validators.required),
      ttcreatedby: new FormControl(''),
      ttmodifiedby: new FormControl(''),
    });
  }


  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.DisplayModal=false
    this.form.reset()
  }

  onSubmit() {
    if(this.ModalType==='UPDATE'){
      this.form.controls['ttmodifiedby'].setValue(this.Cookie.get('username'))
      this.OnUpdate();
    }
    else{
      this.form.controls['ttcreatedby'].setValue(this.Cookie.get('username'))
      this.form.controls['ttmodifiedby'].setValue(this.Cookie.get('username'))
      this.OnSave(this.form.value);
    }
  }

  OnSave(from:any){
    if (this.form.valid) {
      this.maskLoad = true
      this.ApiData.SaveData(this.endpoint, from).subscribe(
        response =>{
          this.maskLoad = false
          this.SavaData(from);
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

  Idame = 'id'

  OnUpdate(){
    if(this.selectedData){
      this.maskLoad = true
      this.ApiData.UpdateData(this.endpoint,this.form.value).subscribe(
        updateres =>{
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

  formaterDataSlice(value:any){
    const formateString = this.datepipe.transform(value, 'dd-MM-yyyy')
    let data = `${formateString}`
    return data
  }

  deleteselectedRows() {
    this.confirmation.confirm({
      message: 'Sure, you want to delete the selected Plant?',
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
      const code = this.selected[i].ttcode;
      this.ApiData.DeleteData(this.endpoint, code,).subscribe(
        () => {
          const index = this.plantData.findIndex(j => j.ttcode === code);
          if (index !== -1) {
            this.maskLoad = false
            this.plantData.splice(index, 1);
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
    const tableElement = document.getElementById('exporttable');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement));
    const numRows = sheetData.length;
    let Heading = [[`PLANT DETAILS FOR CONFIGURE`]];
    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 6 }  },
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
    ws['!cols'] = [{ width: 10 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Plant Configure Details.xlsx`);
    this.maskLoad = false
  }

}
