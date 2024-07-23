import { Component, HostListener, Input, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, } from '@fortawesome/free-solid-svg-icons';
import { WaterCost, PlantNam } from '../Data';
import * as XLSX from 'xlsx-js-style';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-watercost',
  templateUrl: './watercost.component.html',
  styleUrls: ['./watercost.component.css'],
  providers:[DatePipe]
})
export class WatercostComponent implements OnInit {

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
    this.raincost = 0
  }

  waterCosts: any[] = []
  TotalCost(cost: number, value:number) {
    if(cost === 0){
      return 0
    }else{
      return cost*value
    }
  }

  sortDataByTotalCost() {
    this.waterCosts.sort((a, b) => {
      const totalCostA = this.TotalCost(a.wt_cost, a.wt_consume);
      const totalCostB = this.TotalCost(b.wt_cost, b.wt_consume);
      return totalCostA - totalCostB;
    });
  }

  selectedData: any = null
  selected: any = [];
  DisplayModal = false
  raincost!:number

  overallform:  WaterCost[] = []

  WaterCosData : WaterCost[] = []

  source = [
    "Fresh_Water",
    "Treated Water",
    "Rain Water"
  ]

  types : any[] = []
  typesEditable!:boolean

  load = true
  loading = true
  maskLoad:boolean = false

  form:FormGroup;
  costForm: FormGroup;
  mainForm!: FormGroup

  ModalType = 'ADD'

  endpoint = 'costdata'
  SourceName = 'WATER'
  url = 'localhost:3000'

  readonlySelect: boolean = false

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
        this.WaterCosData = response
        this.load = false
        this.loading = false
      })
  }

  SourceChange(source: string){
    if(source === 'Fresh_Water'){
      this.types = ['Outsource', 'Borewell', 'Drinking']             
    }
    else if(source === 'Treated Water'){
      this.types = ['ETP', 'STP', 'Disposed']
    }
    else if(source === 'Rain Water'){
      this.types = ['Harvesting Pits', 'Pit Capacity', 'Roof Area', 'Non-Roof Area', 'Average Rainfall']
    }
  }

  showDialog(){
    this.raincost = 0
    this.ModalType = 'ADD'
    this.DisplayModal=true
    this.selectedData = null
  }

  DisplayCostModal:boolean = false

  showCostModal(Data:any){
    this.DisplayCostModal=true
    this.selectedData = null
    this.ModalType = 'UPDATE'
    this.selectedData = Data;
    this.costForm.patchValue({
      wt_id: Data.wt_id,
      wt_date: Data.wt_date,
      wt_source: Data.wt_source,
      wt_type: Data.wt_type,
      wt_consume: Data.wt_consume
    });
  }

  EditModal(data:WaterCost){
    this.raincost = 0
    this.ModalType = 'UPDATE'
    this.selectedData = data;
    this.DisplayModal = true;
    const source = this.selectedData.wt_type;
    this.formpatchFun(source, data)
    this.form.patchValue(this.selectedData)
    
  }

  SavaData(newData:any){
    this.WaterCosData.push(newData)
  }

  Update(Update:any){
    console.log(Update)
    const i = this.WaterCosData.findIndex((water) => water.wt_id === this.selectedData.wt_id);
    this.WaterCosData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
    this.Outsource.reset()
    this.Borewell.reset()
    this.Drinking.reset()
    this.etp.reset()
    this.stp.reset()
    this.Disposed.reset()
    this.Harvesting_Pits.reset()
    this.Pit_Capacity.reset()
    this.Roof_Area.reset()
    this.NonRoof_Area.reset()
    this.Average_Rainfall.reset()
    this.costForm.reset()
  }

  closeModal(){
    this.resetFrom()
    this.DisplayModal=false
    this.DisplayCostModal=false
  }

  Monthform:FormGroup
  maxDate = new Date();
  DefaultDate = new Date();

  Outsource!: FormGroup
  Borewell!: FormGroup
  Drinking!: FormGroup
  etp!: FormGroup
  stp!: FormGroup
  Disposed!: FormGroup
  Harvesting_Pits!: FormGroup
  Pit_Capacity!: FormGroup
  Roof_Area!: FormGroup
  NonRoof_Area!: FormGroup
  Average_Rainfall!: FormGroup

  freshwaterData:any
  treatedwaterData:any
  rainwaterData:any

  formpatchFun(value:string, patchData:any){
    if(patchData.wt_source === 'Fresh_Water'){
      for(let i=0; i<this.freshwaterData.length; i++){
        if(this.freshwaterData[i].lableName === value){
          this.freshwaterData[i].formGroupName.patchValue(patchData)
        }
      }
    }
    else if(patchData.wt_source === 'Treated Water'){
      for(let i=0; i<this.treatedwaterData.length; i++){
        if(this.treatedwaterData[i].lableName === value){
          this.treatedwaterData[i].formGroupName.patchValue(patchData)
        }
      }
    }
    else if(patchData.wt_source === 'Rain Water'){
      for(let i=0; i<this.rainwaterData.length; i++){
        if(this.rainwaterData[i].lableName === value){
          this.rainwaterData[i].formGroupName.patchValue(patchData)
        }
      }
    }
  }

  ButtonOnDisable(value:string){
    if(this.ModalType==='ADD'){
    let isvalidform
      if(value === 'Fresh_Water'){
        isvalidform = this.form.valid && this.Outsource.valid && this.Drinking.valid && this.Borewell.valid
      }
      else if(value === 'Treated Water'){
        isvalidform = this.form.valid && this.etp.valid && this.stp.valid && this.Disposed.valid
      }
      else if(value === 'Rain Water'){
        isvalidform = this.form.valid && this.Harvesting_Pits.valid && 
        this.Pit_Capacity.valid && this.Roof_Area.valid && this.NonRoof_Area.valid && this.Average_Rainfall.valid
      }
      return !isvalidform
    }
    else{
      let type = this.selectedData.wt_type
      let update
      if(value === 'Fresh_Water'){
        for(let i=0; i<this.freshwaterData.length; i++){
          if(this.freshwaterData[i].lableName === type){
            update = this.form.valid && this.freshwaterData[i].formGroupName.valid
          }
        }
      }
      else if(value === 'Treated Water'){
        for(let i=0; i<this.treatedwaterData.length; i++){
          if(this.treatedwaterData[i].lableName === type){
            update = this.form.valid && this.treatedwaterData[i].formGroupName.valid
          }
        }
      }
      else if(value === 'Rain Water'){
        for(let i=0; i<this.rainwaterData.length; i++){
          if(this.rainwaterData[i].lableName === type){
            update = this.form.valid && this.rainwaterData[i].formGroupName.valid
          }
        }
      }
      return !update
    }
  }

  createWaterTypeFormGroup(): FormGroup {
    return this.fb.group({
      wt_type: [''],
      wt_consume: ['', Validators.required],
      wt_cost: ['', Validators.required],
    });
  }

  createRainWaterTypeFormGroup(): FormGroup {
    return this.fb.group({
      wt_type: [''],
      wt_consume: ['', Validators.required],
      wt_cost: [''],
    });
  }

  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService, private fb: FormBuilder, private datepipe: DatePipe, private Cookie: CookieService) {
    this.form = new FormGroup({
      wt_id: new FormControl(''),
      wt_date: new FormControl('', Validators.required),
      wt_source: new FormControl('', Validators.required),
      wt_state: new FormControl(''),
      wt_cost_conform: new FormControl(''),
    });

    this.Monthform = new FormGroup({
      selectMonth: new FormControl('', Validators.required),
    })

    this.costForm = new FormGroup({
      wt_id: new FormControl(''),
      wt_date: new FormControl(''),
      wt_source: new FormControl(''),
      wt_type: new FormControl(''),
      wt_state: new FormControl(''),
      wt_cost_conform: new FormControl(''),
      wt_cost: new FormControl('', Validators.required),
      wt_consume: new FormControl('')
    })

    this.Outsource = this.createWaterTypeFormGroup()
    this.Drinking = this.createWaterTypeFormGroup()
    this.Borewell = this.createWaterTypeFormGroup()
    this.etp = this.createWaterTypeFormGroup()
    this.stp = this.createWaterTypeFormGroup()
    this.Disposed = this.createWaterTypeFormGroup()
    this.Harvesting_Pits = this.createRainWaterTypeFormGroup()
    this.Pit_Capacity = this.createRainWaterTypeFormGroup()
    this.Roof_Area = this.createRainWaterTypeFormGroup()
    this.NonRoof_Area = this.createRainWaterTypeFormGroup()
    this.Average_Rainfall = this.createRainWaterTypeFormGroup()

    this.freshwaterData = [
      {
        formGroupName:  this.Outsource,
        lableName: 'Outsource',
        units: '(kl)'
      },
      {
        formGroupName: this.Borewell,
        lableName: 'Borewell',
        units: '(kl)'
      },
      {
        formGroupName: this.Drinking,
        lableName: 'Drinking',
        units: '(kl)'
      }
    ]

    this.treatedwaterData = [
      {
        formGroupName:  this.etp,
        lableName: 'ETP',
        units: '(kl)'
      },
      {
        formGroupName: this.stp,
        lableName: 'STP',
        units: '(kl)'
      },
      {
        formGroupName: this.Disposed,
        lableName: 'Disposed',
        units: '(kl)'
      }
    ]

    this.rainwaterData = [
      {
        formGroupName:  this.Harvesting_Pits,
        lableName: 'Harvesting Pits',
        units: '()'
      },
      {
        formGroupName: this.Pit_Capacity,
        lableName: 'Pit Capacity',
        units: '()'
      },
      {
        formGroupName: this.Roof_Area,
        lableName: 'Roof Area',
        units: '()'
      },
      {
        formGroupName: this.NonRoof_Area,
        lableName: 'Non-Roof Area',
        units: '()'
      },
      {
        formGroupName: this.Average_Rainfall,
        lableName: 'Average Rainfall',
        units: '()'
      },
    ]
  }

  ValuesAppendForm(formdata: any) {
    this.overallform = [];
    for (let i = 0; i < formdata.length; i++) {
      this.overallform.push({
        wt_id: this.form.get('wt_id')?.value,
        wt_date: this.form.get('wt_date')?.value,
        wt_source: this.form.get('wt_source')?.value,
        wt_type: formdata[i].lableName,
        wt_consume: formdata[i].formGroupName.controls['wt_consume']?.value, 
        wt_cost: this.form.get('wt_source')?.value === 'Rain Water' ? 0 : formdata[i].formGroupName.get('wt_cost')?.value,
        wt_state: formdata[i].lableName!=='Drinking',
        wt_cost_conform: this.form.get('wt_source')?.value === 'Rain Water' ? true : false,
      });
    }
    return this.overallform
  }


  getUpdateFormValues(UpdateForm:any){
    let type = UpdateForm.wt_type
    let patchForm
    if(UpdateForm.wt_source === 'Fresh_Water'){
      for(let i=0; i<this.freshwaterData.length; i++){
        if(this.freshwaterData[i].lableName === type){
          patchForm = this.freshwaterData[i].formGroupName.value
        }
      }
    }
    else if(UpdateForm.wt_source === 'Treated Water'){
      for(let i=0; i<this.treatedwaterData.length; i++){
        if(this.treatedwaterData[i].lableName === type){
          patchForm = this.treatedwaterData[i].formGroupName.value
        }
      }
    }
    else if(UpdateForm.wt_source === 'Rain Water'){
      for(let i=0; i<this.rainwaterData.length; i++){
        if(this.rainwaterData[i].lableName === type){
          patchForm = this.rainwaterData[i].formGroupName.value
        }
      }
    }
    return patchForm
  }


  onSubmit() {

    if(this.ModalType==='UPDATE' && this.form.get('wt_source')?.value != 'Rain Water'){
      this.costForm.controls['wt_cost_conform'].setValue(true)
      this.costForm.controls['wt_state'].setValue(true)
      // console.log(this.costForm.value)
      this.OnUpdate(this.costForm.value);
    }

    if(this.ModalType==='UPDATE' && this.form.get('wt_source')?.value === 'Rain Water'){
      let getPatchData = this.getUpdateFormValues(this.selectedData)
      
      let UpdateFormData = {
        ...this.form.value,
        ...getPatchData
      }
      // console.log(UpdateFormData)
      this.OnUpdate(UpdateFormData);
    }
    else{

      if(this.form.get('wt_source')?.value === 'Fresh_Water'){
        let getFormValues = this.ValuesAppendForm(this.freshwaterData)
        for(let i=0; i<getFormValues.length; i++){
          this.OnSave(getFormValues[i])
        }
      }
      else if(this.form.get('wt_source')?.value === 'Treated Water'){
        let getFormValues = this.ValuesAppendForm(this.treatedwaterData)
        for(let i=0; i<getFormValues.length; i++){
          this.OnSave(getFormValues[i])
        }
      }
      else if(this.form.get('wt_source')?.value === 'Rain Water'){
        let getFormValues = this.ValuesAppendForm(this.rainwaterData)
        console.log(getFormValues)
        for(let i=0; i<getFormValues.length; i++){
          this.OnSave(getFormValues[i])
        }
      }
    }
  }

  OnSave(form:any){
    if(true){
      this.maskLoad = true
      this.ApiData.SaveCostData(this.endpoint, this.SourceName, form).subscribe(
        response =>{
          this.maskLoad = false
          this.SavaData(form);
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
  OnUpdate(form:any){
    if(this.selectedData){
      this.maskLoad = true
      // console.log(form)
      this.ApiData.UpdateCostData(this.endpoint, this.SourceName, form).subscribe(
        update =>{
          this.maskLoad = false
          this.Update(form);
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
      message: 'Sure, you want to delete the selected Water cost?',
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
      const id = this.selected[i].wt_id;
      this.ApiData.DeleteCostData(this.endpoint, this.SourceName, id).subscribe(
        () => {
          const index = this.WaterCosData.findIndex(j => j.wt_id === id);
          if (index !== -1) {
            this.maskLoad = false
            this.WaterCosData.splice(index, 1);
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
    const tableElement = document.getElementById('exportwattable');
    const sheetname = 'sheet1';
    const wb = XLSX.utils.book_new();
    const tabledata = XLSX.utils.table_to_sheet(tableElement);
    const sheetData: { [key: string]: any }[] = XLSX.utils.sheet_to_json(tabledata, {raw: false, dateNF: 'dd/MM/yyyy'});
    for (const cell of sheetData) {
      cell['DATE'] = this.datepipe.transform(cell['DATE'], 'dd-MM-yyyy')
    }
    console.log(sheetData)
    const numRows = sheetData.length;
    let Heading = [[`WATER COST DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
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
    ws['!cols'] = [{ width: 10 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 25 }, { width: 25 }, { width: 25 }];

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `Water Cost Details.xlsx`);
    this.maskLoad = false
  }

}
