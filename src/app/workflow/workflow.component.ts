import { Component, OnChanges, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, } from '@fortawesome/free-solid-svg-icons';
import { Workflow } from './Data'
import { GroupMan, Source } from '../settings/Data'
import { WorkflowService } from './workflow.service';
import { Tooltip } from 'primeng/tooltip';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  check = faCheck
  cross = faXmark
  down = faChevronCircleDown
  reset = faArrowRotateForward
  add = faPlus
  del = faTrash
  edit = faPenToSquare

  ngOnInit(): void {
    this.form.reset()
    this.GetData()
  }

  selectedValues: string[] = [];

  selectedData: any = null
  selected: any = [];
  DisplayModal=false
  DisplayEditModal = false
  WorkflowData : Workflow[] = []

  load = true
  loading = true
  maskLoad:boolean = false

  form!:FormGroup;
  tableForm!:FormGroup
  ModalType = 'ADD'

  defaultValue = 'SOURCE BACKEND'

  dropGroupData:  GroupMan[] = []
  dropSourceData: Source[] = []

  meternames : any[] = []
  Sourcenames: any[] = []
  Metergroupname: any[] = []

  endpoint = 'workflow'
  CodeEndpoint = 'dropdown'

  MetersEndpoint = 'metername'

  endpointGroup = 'groupmanagement'
  urlGroup = '64490fd0b88a78a8f0fc178a.mockapi.io'

  endpointScr = 'sourcemanagement'
  urlScr = '6464986a127ad0b8f8a2a285.mockapi.io'

  isTooltipDisabled = false
  tooltipEvent: string = '';

  // @ViewChild('selectItem', { static: true }) selectItem: any;
  @ViewChild('selectInput', { read: Tooltip }) selectInputTooltip!: Tooltip;

  cookieCheck(): boolean{
    return this.Cookie.check('username') &&  this.Cookie.check('emailid') && this.Cookie.check('plantname')
  }

  UsertypesAllowed(): boolean {
    return this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'BASE-SUPERVISOR'
  }

  IsAdmin() {
    if(this.cookieCheck() && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg' && this.UsertypesAllowed()){
      return true
    }
    else{
      return false
    }
  }

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      response => {
        this.WorkflowData = response
        this.load = false
        this.loading = false
      })

    this.ApiData.getData(this.endpointGroup).subscribe(
      res => {
        this.dropGroupData = res
        this.Metergroupname = this.dropGroupData.map(group => group.aggroupname);
      })

    this.ApiData.getData(this.endpointScr).subscribe(
      res => {
        this.dropSourceData = res
        this.Sourcenames = this.dropSourceData.map(source => source.assourcename);
      })

    this.ApiData.getData(this.MetersEndpoint).subscribe(
      res => {
        this.meternames = res
      })
  }

  showDialog(){
    if (this.tableForm.valid) {
    this.isTooltipDisabled = true
    this.DisplayModal=true
    this.selectedData = null
    this.ModalType = 'ADD'
    this.form.reset();
    this.maskLoad = true
    this.ApiData.getData(this.CodeEndpoint).subscribe(
      res => {
          this.maskLoad = false
          this.defaultValue = res.wfeventcode
          // console.log(res)
        },
        error => {
          this.maskLoad = false
          this.closeModal()
          this.messageService.add({ severity: 'error', summary: 'Code Not Get', detail: 'Failed', life: 5000 });
          console.log("Error")
        }
      )
    }
    else{
      this.tooltipEvent = 'click';
      this.selectInputTooltip.show()
      this.tableForm.get('selectItem')?.markAsTouched();
    }
  }

  onTypeChange(value:string){

  }

  enableTooltip() {
    this.isTooltipDisabled = false;
    this.tooltipEvent = 'click';
  }

  EditModal(data: Workflow) {
    this.selectedData = data;
    this.DisplayModal = true;
    this.form.patchValue(this.selectedData);
    this.ModalType = 'UPDATE';
    // const isMonitorAllChecked = this.selectedData.sclassification === this.Metergroupname;
    // if (isMonitorAllChecked) {
    //   this.showdropdown = false;
    // } else {
    //   this.showdropdown = true;
    // }
    // console.log(data)
  }

  SavaData(newData:any){
    this.WorkflowData.push(newData)
  }

  Update(Update:any){
    const i = this.WorkflowData.findIndex((water) => water.wfeventcode === this.selectedData.wfeventcode);
    this.WorkflowData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
    this.DisplayEditModal = false
  }

  constructor(private ApiData: WorkflowService, private messageService: MessageService, private confirmation: ConfirmationService, private Cookie: CookieService) {
    this.form = new FormGroup({
      wfeventcode:new FormControl('',Validators.required),
      wfeventname:new FormControl('',Validators.required),
      wfplantname:new FormControl(''),
      wfeventgroup:new FormControl(''),
      wfresetinterval: new FormControl(''),
      wfpriority:new FormControl(''),
      wfactive:new FormControl(''),
      wfdescription:new FormControl('',Validators.required),
      wfalertmessage:new FormControl(''),
      wfcorrectmessage:new FormControl(''),
      wfcreatedon:new FormControl(''),
      wfcreatedby:new FormControl(''),
      wfmodifiedon:new FormControl(''),
      wfmodifiedby:new FormControl(''),
      sclassification:new FormControl(''),
      scategory:new FormControl(''),
      sgroup:new FormControl(''),
      ssource:new FormControl(''),
      smeters:new FormControl(''),
      atoemail:new FormControl('',Validators.required),
      accmail:new FormControl(''),
      asubject:new FormControl('',Validators.required),
      apriority:new FormControl(''),
      amessage:new FormControl('',Validators.required),
      stime:new FormControl('',Validators.required),
      schedule_days:new FormControl('',Validators.required),
    });

    this.tableForm = new FormGroup({
      selectItem:new FormControl('', Validators.required),
    })
  }

  date = new Date()

  showdropdown = true


  onSubmit() {
    if(this.ModalType==='UPDATE'){
      this.form.controls['wfmodifiedon'].setValue(this.date.toISOString().slice(0, 10));
      if(this.form.get('sclassification')?.value === true ){
        const classificationValue = {
          MeterGroup: this.Metergroupname,
          Source: this.Sourcenames,
          Meters: this.meternames
        };
        // this.form.controls['sclassification'].setValue(classificationValue);
      }
      this.OnUpdate();
    }
    else{
      this.form.controls['wfcreatedon'].setValue(this.date.toISOString().slice(0, 10));
      this.form.controls['wfmodifiedon'].setValue(this.date.toISOString().slice(0, 10));
      this.form.controls['sclassification'].setValue(true)
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

  Idnam = 'id'
  OnUpdate(){
    if(this.selectedData){
      this.maskLoad = true
      this.ApiData.UpdateData(this.endpoint, this.form.value).subscribe(
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
      message: 'Sure, you want to delete the selected Workflow?',
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
      const code = this.selected[i].wfeventcode;
      this.ApiData.DeleteData(this.endpoint, code,).subscribe(
        () => {
          const index = this.WorkflowData.findIndex(j => j.wfeventcode === code);
          if (index !== -1) {
            this.maskLoad = false
            this.WorkflowData.splice(index, 1);
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


}
