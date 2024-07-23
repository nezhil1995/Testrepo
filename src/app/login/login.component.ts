import { Component,OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { faEye, faEyeSlash, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { LoginserviseService } from './loginservise.service'
import { CryptoService } from './cypher.service'
import { Router } from '@angular/router';
import { faLightbulb, faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service'
import { AuthService } from '../auth/auth.service';
import { Location } from '@angular/common';
import { gsap } from 'gsap';
import { interval, Subscription } from 'rxjs';
import { UrlService } from '../urls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
  
})
export class LoginComponent implements OnInit {

  @ViewChild('textElement') textElement!: ElementRef;

  word: string = "bdvshfvweherfjhsdfgjkerhfeg"; // Change this to the word you want to animate
  characters: string[] = []; 

  tipsArray: string[] = [
    "Collect utility bill data.", "Identify opportunities to save on costs.", "Analyze meter data.", "Track your progress.",
    "Monitoring energy consumption.", "For optimizing energy efficiency."
  ];
  currentTipIndex: number = 0;
  currentTip: string = '';

  displayNextTip() {
    const randomIndex = Math.floor(Math.random() * this.tipsArray.length);
    this.currentTip = this.tipsArray[randomIndex];
    this.splitWord();
    this.animateCharacters(0);
  }


  splitWord() {
    this.characters = this.currentTip.split('');
    this.textElement.nativeElement.textContent = ''; // Clear the text initially
  }

  animateCharacters(index: number) {
    if (index < this.characters.length) {
      gsap.fromTo(this.textElement.nativeElement, {
        duration: 0.1,
        textContent: this.characters.slice(0, index).join('')
      }, {
        duration: 0.1,
        textContent: this.characters.slice(0, index + 1).join(''),
        ease: "power1.inOut",
        onComplete: () => {
          this.animateCharacters(index + 1);
        }
      });
    } else {
      setTimeout(() => {
        this.displayNextTip();
      }, 2500);
    }
  }

  ngAfterViewInit(): void {
    this.displayNextTip();
  }



  maskLoad:boolean = false

  eye = faEye
  eyeCls = faEyeSlash
  log = faRightToBracket

  light = faLightbulb
  solar = faSolarPanel

  AutencateData: any

  form:FormGroup;

  showPassword: boolean = false;

  texts: string[] = ["Hello", "World", "This", "Is", "Auto-Typing"];
  currentIndex: number = 0;
  currentText: string = "";
  typingText: string[] = [];


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.Cookie.deleteAll()
    // this.form.controls['plantname'].setValue('MATE U-I')
  }


  constructor(private loginAut: LoginserviseService, private messageService: MessageService, private router: Router, private Cookie: CookieService, private Auth: AuthService, private Plants: UrlService){
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      plantname: new FormControl('', Validators.required),
    })
  }

  plants = this.Plants.Urldata

  Loggedin = false


  isLoginIn(): boolean {
    if(this.Loggedin){
      return true
    }
    return false
      
  }

  CheckCookie():boolean{
    if(this.Cookie.check('username') &&  this.Cookie.check('emailid')){
      return true
    }
    return false
  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }
  

  login(): void {
    this.Cookie.delete('plantname')
    this.Cookie.set('plantname', this.form.get('plantname')?.value)
    this.Plants.UrlsSelectedPlant();
    if(this.form.valid){
      this.maskLoad = true
      this.loginAut.getData(this.form.value).subscribe(
        res=> {
        let string = res.toString()
        let valid = res.validationstring
        // const key = await this.Encription.generateKey();
        // const encryptedToken = await this.Encription.encrypt(res.token, key);
        if(valid === 'Email ID and Password matches'){
          this.Cookie.set('plantname',res.plantname)
          this.Cookie.set('username',res.username)
          this.Cookie.set('emailid',res.emailid)
          this.Cookie.set('firstname',res.firstname)
          this.Cookie.set('lastname',res.lastname)
          this.Cookie.set('type',res.type)
          this.Cookie.set('language',res.language)
          this.Cookie.set('location',res.address1)
          this.Cookie.set('seceretkey',res.seceretkey)
          this.Cookie.set('Sec_User_toc', res.tokenID)
          this.Cookie.set('lon',res.lon)
          this.Cookie.set('lat',res.lat)
          this.Cookie.set('Auth_plants', res.authplants)
          this.Cookie.set('ClusterId', res.authcluster)
          this.Cookie.set('firstlog', '0'),
          this.Cookie.set('Currency_code', res.curcode)
          if(this.CheckCookie()){
            if(res.type === 'CLUSTER-ADMIN'){
              this.Loggedin = true
              this.router.navigate(['/clusterhead-dashboard'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' })
            }
            else if(res.type === 'SUPERCLUSTER-ADMIN'){
              this.Loggedin = true
              this.router.navigate(['/super-clusterhead-dashboard'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' })
            }
            else {
              this.Loggedin = true
              this.router.navigate(['/dashboard/energy-consumption'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' })
            }
            this.messageService.add({ severity: 'success', summary: `Welcome ${this.Cookie.get('username').toUpperCase()}`, detail: 'Login Successful', life: 10000 });
            this.maskLoad = false
          }
        }
        else if(string == 'User already login'){
          this.maskLoad = false
          this.Cookie.deleteAll();
          this.messageService.add({ severity: 'error', summary: 'Login Error', detail: 'User already logged in', life: 4000 });
        }
        else{
          this.maskLoad = false
          this.Cookie.deleteAll();
          this.messageService.add({ severity: 'error', summary: 'Authencation Failed', detail: 'Invalid Username or Password', life: 2000 });
        }
      },
      error =>{
        this.maskLoad = false
        this.messageService.add({ severity: 'error', summary: 'Server Error', detail: 'Response Not Completed', life: 2000 }); 
        console.log('Error')
      })
    }
  }


}
