import { Component, HostListener, Input,  OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, faUserPen, faComputer, faGears, faLayerGroup, } from '@fortawesome/free-solid-svg-icons';
import { Session } from '../Data';
import * as XLSX from 'xlsx-js-style'

@Component({
  selector: 'app-sessiondia',
  templateUrl: './sessiondia.component.html',
  styleUrls: ['./sessiondia.component.css']
})
export class SessiondiaComponent implements OnInit, OnChanges {

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
  gro = faLayerGroup

  sess: any[] = []

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
    this.sess = [ 'Peak', 'Non-Peak', 'Night', 'Normal']
  }

  defaultValue: string = 'SOURCE';

  selectedData: any = null
  selected: any = [];
  sessionData : Session[] = []

  DisplayModal = false
  load = true
  loading = false;
  maskLoad:boolean = false

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

  endpoint = 'peakhourconfig'
  CodeEndpoint='pkcode'

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      response => {
        this.sessionData = response
        this.load = false
      }
    )
  }

  showDialog(){
    this.DisplayModal=true
    this.selectedData = null
    this.ModalType = 'ADD'
    this.maskLoad = true
    this.ApiData.getData(this.CodeEndpoint).subscribe(
      res => {
        this.maskLoad = false
        this.defaultValue = res.pkcode
      },
      error => {
        this.maskLoad = false
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Get', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    )
  }

  EditModal(data:Session){
    this.selectedData = data;
    this.DisplayModal = true;
    this.form.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
  }

  SavaData(newData:any){
    this.sessionData.push(newData)
  }

  Update(Update:any){
    const i = this.sessionData.findIndex((session) => session.pkcode === this.selectedData.pkcode);
    this.sessionData[i] = Update;
  }

  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService) {
    this.form = new FormGroup({
      pkcode: new FormControl('', Validators.required),
      pkstatus: new FormControl('', Validators.required),
      pkstart: new FormControl('', Validators.required),
      pkend: new FormControl('', Validators.required)
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
      this.OnUpdate();
    }
    else{
      this.OnSave(this.form.value);
    }

  }

  OnSave(form:any){
    if (this.form.valid) {
      this.maskLoad = true
      this.ApiData.SaveData(this.endpoint, form).subscribe(
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

  deleteselectedRows() {
    this.confirmation.confirm({
      message: 'Sure, you want to delete the selected Session?',
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
      const code = this.selected[i].pkcode;
      this.ApiData.DeleteData(this.endpoint, code,).subscribe(
        () => {
          const index = this.sessionData.findIndex(j => j.pkcode === code);
          if (index !== -1) {
            this.maskLoad = false
            this.sessionData.splice(index, 1);
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
    const tableElement = document.getElementById('exportsesstable');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement));
    const numRows = sheetData.length;
    let Heading = [[`SESSION DETAILS`]];
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
    XLSX.writeFile(wb, `Session Configure Details.xlsx`);
    this.maskLoad = false
  }

}
