import { Component, OnInit, OnDestroy, DoCheck  } from '@angular/core';
import { Router } from '@angular/router';
import { faHome, faBell, faUserCheck, faArrowUpFromBracket, faHourglass1, faPaperPlane, faLocationDot, faArrowTrendUp, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { DashboardService } from '../dashboard/dashboard.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { faTemperatureDown, faTemperatureUp, faTemperatureHigh, faDroplet} from '@fortawesome/free-solid-svg-icons';
import { interval } from 'rxjs';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})

export class NavbarComponent implements OnInit, OnDestroy, DoCheck  {

  house = faHome
  bell = faBell
  user = faUserCheck
  out = faArrowUpFromBracket
  hour = faHourglass1
  send = faPaperPlane
  loc = faLocationDot
  arrow = faArrowTrendUp

  temp = faTemperatureHigh
  maxTemp = faTemperatureUp
  minTemp = faTemperatureDown
  hum = faDroplet

  W_load = true
  visible = false
  Imgheight = '47px'
  maskLoad:boolean = false
  notifyLoad:boolean = false

  weatherData:any

  location1 = ''
  main:any
  weather:any
  wind:any
  clouds:any
  sys:any
  visibility!: number
  riseTime:any
  setTime:any
  currentTime:any

  DayNightStr = 'day'
  ImagePath = '../../assets/weatherUi/'

  date:any
  DefaultData: any

  Clickprint(){
    window.print()
  }

  getCurrentDate() {
    this.date = new Date().toISOString().slice(0, 10)
    this.DefaultData = new Date().toISOString().slice(0, 10)
  }

  showWeatherDia(){
    this.visible = true
    this.sidebarVisible = false
  }

  Hidesidebar(){
    this.sidebarVisible = false
  }

  form: FormGroup
  NotifyForm: FormGroup

  messages:any[] = []
  allMessages:any
  
  DisplayUserModal = false
  DisplayMailDialog = false
  DisplayNotifiDialog = false

  roueterlink = ''

  sidebarVisible=false

  ShowSidebar(){
    this.sidebarVisible = true
  }

  constructor(private Cookie: CookieService, private router: Router, private Apidata: DashboardService, private confirmation: ConfirmationService, private messageService: MessageService, private datePipe: DatePipe, private routerlocation: Location) {
    this.form = new FormGroup({
      report_type: new FormControl('', Validators.required),
      email: new FormControl<string[] | null>(null, [Validators.required, this.EmailLengthValidator(255)]),
    })

    this.NotifyForm = new FormGroup({
      date: new FormControl('', Validators.required),
    })

    if(this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'BASE-USER'){
      this.roueterlink = 'dashboard/energy-consumption'
    }

  }

  EmailLengthValidator(maxLength: number): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const emailArray: string[] = control.value;
      
      if (emailArray) {
        const mergedEmail = emailArray.join('; ');
        if (mergedEmail.length > maxLength) {
          return { 'emailConcatenationLengthExceeded': true };
        }
      }
      return null;
    };
  }

  Name = ''
  Email = ''
  Unit = ''
  UnitName = ''
  location = ''
  type = ["Daily Report", "Carbon Report"]

  timer: any;
  startTime: number = 0;
  elapsedTime: number = 0;
  isRunning: boolean = false;
  countdownDuration: number = 60 * 60 * 1000; // 1 hour in milliseconds

  ngOnInit(): void {
    // this.checkUserLogin();
    this.GetNofification()
    this.UnitName = this.Cookie.get('plantname')
    this.location = this.Cookie.get('location')
    this.currentTime = Math.floor(Date.now() / 1000);
    this.location = this.Cookie.get('location')
    this.GetWeatherData()
    this.getCurrentDate()
    this.startupNotify()
  }

  showWetLocName!:boolean

  ngDoCheck() {
    const location = this.Cookie.get('location');
    if (location !== this.location) {
      this.UnitName = this.Cookie.get('plantname')
      this.location = this.Cookie.get('location')
      this.W_load = true
      this.GetWeatherData()
    }
    if(this.Cookie.get('type') === 'CORPORATE-ADMIN' || this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN' || this.Cookie.get('type') === 'CLUSTER-ADMIN'){
      this.showWetLocName = false
    }
    else {
      this.showWetLocName = true
    }
    
  }

  notifyEndpoint = 'notification/broadcast'
  NotifyAllEnd = 'notification'


  startupNotify(){
    this.notifyLoad = true
    let FormValue = {date:this.DefaultData}
    this.Apidata.NotifyConnect(this.NotifyAllEnd, FormValue).subscribe(
      res=>{
        this.allMessages = res
        this.messages = this.allMessages.HistoryData
        this.notifyLoad = false
      }
    )
  }

  onDateChange(value:any){
    this.notifyLoad = true
    let FormValue = this.NotifyForm.value
    this.messages = []
    this.Apidata.NotifyConnect(this.NotifyAllEnd, FormValue).subscribe(
      res=>{
        this.allMessages = res
        this.messages = this.allMessages.HistoryData
        this.notifyLoad = false
      }
    )
  }

  BadgeNotify:string = '0'
  BadgeShow:boolean = true

  excessName(value:string): string{
    if(value === 'KVA'){
      return 'Exceeded'
    }
    else if(value === 'Power Factor'){
      return 'Droped'
    }
    else{
      return '';
    }
  }

  GetNofification(){
    if(this.router.url === '/dashboard'){
      const websocket = this.Apidata.NotificationSocket(this.notifyEndpoint);
      let count = 0
      websocket.subscribe(
        (message) => {
            this.messages.unshift(message.message)
            // console.log(this.messages)
            this.messageService.add({ severity: 'warn', summary: 'Alert', detail:`${message.message.nf_excessName} ${this.excessName(message.message.nf_excessName)}`, life: 7000 });
            count += 1
            this.BadgeNotify = count.toString()
        },
        (error) => {
            console.error('WebSocket Error:', error)
        },
        () => {
            console.log('WebSocket Connection Closed')
        }
      );
    }
  }

  ngAfterViewInit(): void {
    interval(32 * 60 * 1000).subscribe(() => {
      // this.W_load = true
      this.GetWeatherData();
    });
  }

  GetWeatherData(){
    if(this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'BASE-USER'){
      this.Apidata.WeatherGetData().subscribe(
        res=>{
          this.weatherData = res
          this.main = this.weatherData.main
          this.weather = this.weatherData.weather[0]
          this.wind = this.weatherData.wind
          this.sys = this.weatherData.sys
          this.W_load = false
          this.unixTimeConvert(this.sys.sunrise, this.sys.sunset)
        }
      )
    }
  }

  unixTimeConvert(sunrise:number,sunset:number){
    let rise, set
    const isDayTime = this.currentTime >= sunrise && this.currentTime <= sunset;
    rise = new Date(sunrise * 1000)
    set = new Date(sunset * 1000)
    this.riseTime = this.datePipe.transform(rise, 'HH:mm');
    this.setTime = this.datePipe.transform(set, 'HH:mm');
    if (isDayTime) {
      this.DayNightStr = 'day'
    }
    else {
      this.DayNightStr = 'night'
    }
  }

  farenHeatCon(value:number){
    return ((value * 9/5) + 32).toFixed(1);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  checkUserLogin(): void {
    if (this.isLoggedIn()) {
      this.startTimer();
    }
  }

  isLoggedIn(): boolean {
    return (
      this.Cookie.check('username') &&
      this.Cookie.check('emailid') &&
      this.Cookie.check('plantname')
    );
  }

  startTimer(): void {
    if (!this.isRunning) {
      const storedStartTime = localStorage.getItem('timerStartTime');
      if (storedStartTime) {
        this.startTime = parseInt(storedStartTime, 10);
      } else {
        this.startTime = Date.now();
        localStorage.setItem('timerStartTime', this.startTime.toString());
      }

      this.elapsedTime = Date.now() - this.startTime;

      this.timer = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;

        if (this.elapsedTime >= this.countdownDuration) {
          this.stopTimer();
          this.logout();
        }
      }, 1000); // Update elapsed time every second (1000 milliseconds)

      this.isRunning = true;
    }
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.isRunning = false;
  }

  resetTimer(): void {
    localStorage.removeItem('timerStartTime');
    this.startTime = Date.now();
    localStorage.setItem('timerStartTime', this.startTime.toString());
    this.elapsedTime = 0;
  }

  formatTime(): string {
    const remainingTime = this.countdownDuration - this.elapsedTime;

    const seconds = Math.floor(remainingTime / 1000) % 60;
    const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  userType = ''

  showNotifiModal(){
    this.sidebarVisible = false
    this.DisplayNotifiDialog = true
    this.BadgeNotify = '0'
  }

  showUserModal(){
    this.DisplayUserModal=true
    this.sidebarVisible = false
    this.Name = this.Cookie.get('username')
    this.Email = this.Cookie.get('emailid')
    this.Unit = this.Cookie.get('plantname')
    this.userType = this.Cookie.get('type')
  }

  logout(): void {
    this.maskLoad = true
    this.stopTimer();
    localStorage.removeItem('timerStartTime');
    this.messageService.add({ severity: 'success', summary: `Success`, detail: 'Successfully Logged Out', life: 15000 });
    this.Cookie.deleteAll();
    this.router.navigate(['/']).then(() => {
      this.routerlocation.replaceState(this.router.url);
      window.location.reload();
    });;
    this.maskLoad = false
  }

  showeveolop(){
    this.DisplayMailDialog = true
    this.sidebarVisible = false
  }

  closeCommonModal(){
    this.DisplayNotifiDialog = false
    this.DisplayUserModal = false
  }

  closeEmailModal(){
    this.DisplayMailDialog = false
    this.form.reset()
  }

  endpoint = ''
  emailLengthExceeded: boolean = false;

  Onvaluechange(value:string){
    if(value === 'Daily Report')
    {
      this.endpoint = 'apireport'
    }
    else if(value === 'Carbon Report')
    {
      this.endpoint = 'carbonreport'
    }
  }

  OnSubmit(){
    this.confirmation.confirm({
      message: 'Are You Sure, want to Send the Report?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mailSubmit();
      }
    });
  }


  mailSubmit(){
    this.maskLoad = true
    if(this.form.valid){
      let EmailData = this.form.get('email')?.value
      let mergeEmail = EmailData.join(';')
      let formData = {
        email: mergeEmail
      }
      this.Apidata.EmailPostData(this.endpoint, formData).subscribe(
        res => {
          this.maskLoad = false
          this.messageService.add({ severity: 'success', summary: 'Report Sent', detail:'Sucessfully', life: 5000 });
          this.closeEmailModal()
        },
        error => {
          this.maskLoad = false
          this.messageService.add({ severity: 'error', summary: 'Report Sent', detail: 'Failed', life: 5000 });
          console.log("Error")
        }
      )
    }
  }

  NotofySocEndpoint = 'ws/notification'


  weatherCodeImage(main:string): any{

    let imgName

    if(main === 'Clear'){
      switch(this.weather.description){
        case 'clear sky': imgName = this.DayNightStr
          break
        default: imgName = this.DayNightStr
      }
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Clouds'){
      switch(this.weather.description){
        case 'few clouds': imgName = 'cloudy-' + this.DayNightStr + '-2'
          break
        case 'scattered clouds': imgName = 'cloudy-' + this.DayNightStr + '-3'
          break
        case 'broken clouds': imgName = 'cloudy'
          break
        case 'overcast clouds': imgName = 'cloudy'
          break
        default: imgName = 'cloudy'
      }
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Rain'){
      switch(this.weather.description){
        case 'light rain': imgName = 'rainy-1'
          break
        case 'moderate rain': imgName = 'rainy-2'
          break
        case 'heavy intensity rain': imgName = 'rainy-3'
          break
        case 'very heavy rain': imgName = 'rainy-3'
          break
        case 'extreme rain': imgName = 'rainy-6'
          break
        case 'light intensity shower rain': imgName = 'rainy-4'
          break
        case 'shower rain': imgName = 'rainy-5'
          break
        case 'ragged shower rain': imgName = 'rainy-6'
          break
        case 'heavy intensity shower rain': imgName = 'rainy-5'
          break
        default: imgName = 'rainy-5'
      }
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Snow'){
      imgName = 'snowy-5'
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Thunderstorm'){
      imgName = 'thunder'
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Drizzle'){
      imgName = 'rainy-7'
      return `${this.ImagePath}${imgName}.svg`
    }

    else if(main === 'Mist'){
      imgName = 'mist'
      this.Imgheight = '20px'
      return `${this.ImagePath}${imgName}.gif`
    }

    else{
      imgName = 'weather'
      return `${this.ImagePath}${imgName}.svg`
    }
  }


}
