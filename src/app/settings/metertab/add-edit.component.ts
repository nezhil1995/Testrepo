import { Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { HttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Data, GroupMan, PlantNam, Source } from '../Data';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from 'xlsx-js-style';

interface plant {
  name: string;
}
interface groupname {
  groupname: string;
}
interface catagery {
  name: string;
}
interface source {
  name: string;
}


@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})


export class AddEditComponent implements OnInit, OnChanges {

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
  warning = faTriangleExclamation

  load = true
  loading = true;
  maskLoad:boolean = false

  // dropdown data
  dropGroupData:  GroupMan[] = []
  dropPlantData: PlantNam[] = []
  dropSourceData: Source[] = []

  Metergroupname : any
  plants:any
  metersrc:any

  defaultValue: string = 'SOURCE';

  meterCat =[
    {name:'Primary'},
    {name:'Secondary'},
  ]

  public getScreenWidth: any;
  public getScreenHeight: any;

  TableHeight: string = '475px';

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
    this.getData()
    this.form.reset()
    this.form.controls['amconsiderbool'].setValue(true)
  }

  ngOnChanges(): void {
    if(this.selectedMeter){
      this.form.patchValue(this.selectedMeter)
      this.ModalType = 'UPDATE'
    }
    else{
      this.form.reset();
      this.ModalType = 'ADD'
    }
  }

  selectedOption!: plant

  meterdata: Data[] = []

  endpoint = 'metermanagement'
  idName = 'amid'

  form:FormGroup;

  ModalType = 'ADD'

  selectedData: any = []
  selectedMeter: any = null;
  DisplayModal=false
  CodeEndpoint='mcode'

  showDialog(){
    this.DisplayModal=true
    this.selectedMeter=null
    this.ModalType = 'ADD'
    this.maskLoad = true
    this.ApiData.getData(this.CodeEndpoint).subscribe(
      res => {
        this.maskLoad = false
        this.defaultValue = res.ammetercode
      },
      error => {
        this.maskLoad = false
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Get', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    )
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
  }

  EditModal(meterdata: Data){
    this.selectedMeter = meterdata;
    this.DisplayModal = true;
    this.form.patchValue(this.selectedMeter)
    this.ModalType = 'UPDATE'
   }

  SavaData(newData:any){
    this.meterdata.push(newData)
  }

  resetFrom(){
    this.form.reset();
  }

  endpointGroup = 'groupmanagement'
  endpointPlant = 'generalconfig'
  endpointScr = 'sourcemanagement'
  // endpoint

  private sub!: Subscription;

  getData(){
    this.ApiData.getData(this.endpoint).subscribe(
      res => {
        this.meterdata = res
        this.sub = this.route.queryParams.subscribe(params => {
          this.loginType = (params['isAdmin']==='true' && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg');
        });
        this.load = false
        this.loading = false
      })

    this.ApiData.getData(this.endpointGroup).subscribe(
      res => {
        this.dropGroupData = res
        this.Metergroupname = this.dropGroupData.map((data) => ({ groupname: data.aggroupname }));
      })

    this.ApiData.getData(this.endpointPlant).subscribe(
      res => {
        this.dropPlantData = res
        this.plants = this.dropPlantData.map((data) => ({ name: data.ttplntname }));
      })

    this.ApiData.getData(this.endpointScr).subscribe(
      res => {
        this.dropSourceData = res
        this.metersrc = this.dropSourceData.map((data) => ({ name: data.assourcename }));
      })
  }

  UpdateData(Update:any){
    const i = this.meterdata.findIndex((user) => user.ammetercode === this.selectedMeter.ammetercode);
    this.meterdata[i] = Update;
  }

  constructor(private ApiData: SettingsService, private jsondata:HttpClient, private messageService: MessageService, private confirmation: ConfirmationService, private route: ActivatedRoute, private Cookie: CookieService ) {
    this.form = new FormGroup({
      ammetername: new FormControl(null, Validators.required),
      ammetercode: new FormControl(null, Validators.required),
      ammetergroup: new FormControl('', Validators.required),
      ammetercategory: new FormControl('', Validators.required),
      ammetersource: new FormControl('', Validators.required),
      ammeterlocation: new FormControl('', Validators.required),
      amplantname: new FormControl('', Validators.required),
      ammeterthreshold: new FormControl('', Validators.required),
      // ammeterminthreshold: new FormControl(''),
      amconsiderbool: new FormControl(''),
    });
  }

  onSubmit() {
    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
    }
    else{
      this.OnSave(this.form.value);
    }
  }

  OnSave(data: any){
    if(this.form.valid) {
      this.maskLoad = true
      this.ApiData.SaveData(this.endpoint, data).subscribe(
        response =>{
          this.maskLoad = false
          this.SavaData(data)
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
    if(this.selectedMeter){
      this.maskLoad = true
      this.ApiData.UpdateData(this.endpoint, this.form.value).subscribe(
        updateres =>{
          this.maskLoad = false
          this.UpdateData(this.form.value)
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

  deletemeterRows() {
    this.confirmation.confirm({
      message: 'Sure, you want to delete the selected Meter?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.maskLoad = true
        this.DeleteMeter();
      }
    });
  }


  DeleteMeter() {
    for (let i = 0; i < this.selectedData.length; i++)
    {
      const code = this.selectedData[i].ammetercode;
      this.ApiData.DeleteData(this.endpoint, code).subscribe(
        () => {
          const index = this.meterdata.findIndex(j => j.ammetercode === code);
          if (index !== -1) {
            this.maskLoad = false
            this.meterdata.splice(index, 1);
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
    this.selectedData = [];
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
    let Heading = [[`METER DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
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
    ws['!cols'] = [{ width: 10 }, { width: 35 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];

    
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Meter Details.xlsx`);
    this.maskLoad = false
  }

}
