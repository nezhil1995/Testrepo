import { Component, Input, OnChanges, OnInit, DoCheck, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { SettingsService } from '../settings.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { faCheck, faXmark, faChevronCircleDown, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrash, faPenToSquare, faUserPen, faComputer, faGears, faWarehouse, faBusinessTime, faLayerGroup, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { User, PlantNam } from '../Data';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-userdialog',
  templateUrl: './userdialog.component.html',
  styleUrls: ['./userdialog.component.css'],
})

export class UserdialogComponent implements OnInit, OnChanges {

  cookieCheck(): boolean{
    return this.Cookie.check('username') &&  this.Cookie.check('emailid') && this.Cookie.check('plantname')
  }

  UsertypesAllowed(): boolean {
    return this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'CORPORATE-ADMIN' || this.Cookie.get('type') === 'CLUSTER-ADMIN' || this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN'
  }

  IsAdmin() {
    if(this.cookieCheck() && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg' && this.UsertypesAllowed()){
      return true
    }
    else{
      return false
    }
  }

  loginType!:boolean

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

  form!:FormGroup;
  ModalType = 'ADD'

  defaultValue: string = '';
  modal = true

  load: boolean = true
  maskLoad:boolean = false
  loading = false;

  UserData: User[] = []

  selectedData: any = null
  selected: any = [];
  DisplayModal=false

  dropPlantData: PlantNam[] = []
  plants:any

  userType:any = []

  language = [
    {name:'English'}
  ]

  userTypeCorprate(){
    return (this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'CORPORATE-ADMIN' || this.Cookie.get('type') === 'CLUSTER-ADMIN' || this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN') && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg'
  }

  UserInput(){
    if(this.userTypeCorprate()){
      this.userType = [
        {name:'BASE-USER'},
        {name:'BASE-ADMIN'},
        {name:'CLUSTER-ADMIN'},
        {name:'SUPERCLUSTER-ADMIN'},
      ]
    }
    else{
      this.userType = [
        {name:'BASE-ADMIN'},
        {name:'BASE-USER'}
      ]
    }
  }

  private sub!: Subscription;

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

  ngOnInit() :void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(this.getScreenHeight >= 900){
      this.TableHeight = '685px'
    }
    else{
      this.TableHeight = '475px'
    }
    this.UserInput()
    this.GetData()
    // this.GetDetails()
  }

  clustersEndpoint = 'selectclusters'

  ClustersData:any[] = []

  onUserTypeChange(value:string){
    if(value === 'SUPERCLUSTER-ADMIN'){
      this.form.controls['udplantAuth'].setValue(null)
    }
    else if(value === 'CLUSTER-ADMIN'){
      this.form.controls['udClusters'].setValue(null)
    }
    else {
      this.form.controls['udplantAuth'].setValue(null)
      this.form.controls['udClusters'].setValue(null)
    }
  }

  EditAccess(EditUserlevel:string){
    if(this.Cookie.get('type') === 'BASE-ADMIN' && (EditUserlevel === "CLUSTER-ADMIN" || EditUserlevel === "SUPERCLUSTER-ADMIN")){
      return false
    }
    else{
      return false
    }
  }


  endpoint = 'usermanagement'
  endpointPlant = 'generalconfig'
  CodeEndpoint = 'ucode'

  GetData(){
    this.ApiData.getData(this.endpoint).subscribe(
      response =>{
        this.UserData = response
        this.sub = this.route.queryParams.subscribe(params => {
          this.loginType = (params['isAdmin']==='true' && this.Cookie.get('seceretkey') === '@n6%mhd$36fbg');
          // console.log(params, this.loginType);
        });
        this.load = false
      })
  }

  ngOnChanges():void{
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
    this.ModalType = 'ADD'
    this.DisplayModal=true
    this.selectedData = null
    this.maskLoad = true
    this.GetDetails()
  }

 GetDetails(){
    this.ApiData.getData(this.CodeEndpoint).subscribe(
      res => {
        this.plants = res.udplant
        if( this.ModalType === 'ADD'){
          this.maskLoad = false
          this.defaultValue = res.udusercode
        }
        else {
          this.form.patchValue(this.selectedData)
        }
        this.maskLoad = false
        
      },
      error => {
        this.maskLoad = false
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Get', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    )
    // this.maskLoad = true
    this.ApiData.getData(this.clustersEndpoint).subscribe(
      res =>{
        this.ClustersData = res
        this.maskLoad = false
      }
    )
  }

  EditModal(data:User){
    this.ModalType = 'UPDATE'
    this.maskLoad = true
    this.GetDetails()
    this.defaultValue = data.udusercode
    this.selectedData = data
    this.DisplayModal = true;
  }

  SavaData(newData:any){
    this.UserData.push(newData)
  }

  Update(Update:any){
    const i = this.UserData.findIndex((user) => user.udusercode === this.selectedData.udusercode);
    this.UserData[i] = Update;
  }

  resetFrom(){
    this.form.reset();
  }

  closeModal(){
    this.form.reset();
    this.DisplayModal=false
  }

  constructor(private ApiData: SettingsService, private messageService: MessageService, private confirmation: ConfirmationService, private Cookie: CookieService, private route: ActivatedRoute){
    this.form = new FormGroup({
      udid: new FormControl(''),
      udusername: new FormControl('', [Validators.required, this.noWhitespaceValidator1]),
      udusercode: new FormControl('', Validators.required),
      udemail: new FormControl('', [Validators.required, Validators.email]),
      udfirstName: new FormControl('', Validators.required),
      udlastName: new FormControl('', Validators.required),
      udtype: new FormControl('', Validators.required),
      udplantname: new FormControl('', Validators.required),
      udlanguage: new FormControl(''),
      udpassword: new FormControl('', Validators.required),
      udconfirmpassword: new FormControl('', Validators.required,),
      udaddress1: new FormControl('', Validators.required),
      udaddress2: new FormControl(''),
      udscrectkey: new FormControl(''),
      udplantAuth: new FormControl(''),
      udClusters: new FormControl('')
    },{ validators: this.passwordMatchValidator });
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  noWhitespaceValidator1(control: FormControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null
  {
    const password = control.get('udpassword')?.value;
    const confirmPassword = control.get('udconfirmpassword')?.value;
    if (password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
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
    this.maskLoad = true
    if (this.form.valid) {
      this.ApiData.SaveData(this.endpoint, form).subscribe(
        response =>{
          this.maskLoad = false
          this.SavaData(form)
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
    if(this.selected){
      this.maskLoad = true
      this.ApiData.UpdateData(this.endpoint, this.form.value).subscribe(
        update =>{
          this.maskLoad = false
          this.Update(this.form.value)
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
      message: 'Sure, you want to delete the selected User?',
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
      const code = this.selected[i].udusercode;
      // console.log(id)
      this.ApiData.DeleteData(this.endpoint, code).subscribe(
        () => {
          const index = this.UserData.findIndex(j => j.udusercode === code);
          if (index !== -1) {
            this.UserData.splice(index, 1);
            this.maskLoad = false
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
          this.maskLoad = false
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
    let Heading = [[`USER DETAILS FOR ${this.Cookie.get('plantname').toUpperCase()}`]];
    const merge = [
      { s: { r: 1, c: 1 }, e: { r: 1, c: 8 }  },
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
    ws['!cols'] = [{ width: 10 }, { width: 35 }, { width: 15 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 15 } ];

    
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `User Details.xlsx`);
    this.maskLoad = false
  }

}


