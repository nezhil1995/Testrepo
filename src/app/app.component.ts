import { Component, OnInit, TemplateRef, HostListener,  } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JoyrideService }from 'ngx-joyride';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  maskLoad:boolean = false;
  title = 'r-energy';
  user = this.Cookie.get('type')
  load:boolean = true
  currentUrl!: string;
  
  constructor(private router: Router, private Cookie: CookieService, private Joyride: JoyrideService) {
    window.addEventListener("load", ()=>{
      this.load = false;
    })
  }

  ChangeUrl!:string

  ngOnInit(): void {
    window.scroll(0,0);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.go(1)
    };

    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.ChangeUrl = event.url
      if(this.Cookie.check('username') && (this.Cookie.get('type') === 'BASE-ADMIN' || this.Cookie.get('type') === 'BASE-USER')){
        if(this.getRouter().url == '/'){
          this.router.navigate(['/dashboard/energy-consumption'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' });
        }
        else{
          this.router.navigateByUrl(this.ChangeUrl);
        }
        
      }
      else if(this.Cookie.check('username') && this.Cookie.get('type') === 'CLUSTER-ADMIN'){
        if(this.getRouter().url == '/'){
          this.router.navigate(['/clusterhead-dashboard'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' });
        }
        else {
          this.router.navigateByUrl(this.ChangeUrl);
        }
      }
      else if(this.Cookie.check('username') && this.Cookie.get('type') === 'SUPERCLUSTER-ADMIN'){
        if(this.getRouter().url == '/'){
          this.router.navigate(['/super-clusterhead-dashboard'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' });
        }
        else {
          this.router.navigateByUrl(this.ChangeUrl);
        }
      }
      else {
        this.router.navigate(['/']);
      }
  
    });
    
  }

  AdminCurrency(){
    return this.Cookie.get('Currency_code')
  }

  ngDoCheck() {
    const newUser = this.Cookie.get('type');
    if (newUser !== this.user) {
      this.user = newUser;
      setTimeout(() => {
          this.Tour()
      }, 5000)
    }
  }

  superclusetyadminRouterCheck(){
    return this.Cookie.get('type') == 'CLUSTER-ADMIN'
  }


  showOnlyfor(){
    return (this.Cookie.get('Auth_Admin') === 'CLUSTER-ADMIN' || this.Cookie.get('Auth_Admin') === 'SUPERCLUSTER-ADMIN') && !this.superclusetyadminRouterCheck()
  }

  backContent!: TemplateRef<any>

  Tour(){
    if(this.Cookie.get('type') == 'BASE-ADMIN'){
      this.Joyride.startTour({ 
          steps: ['first'],
          showPrevButton: true,
          stepDefaultPosition: 'top',
        }
      )
    }
  }

  backAuth(){
    if(this.Cookie.get('Auth_Admin') === 'CLUSTER-ADMIN'){
      this.Cookie.delete('type')
      this.Cookie.set('type', 'CLUSTER-ADMIN')
      this.router.navigate(['/clusterhead-dashboard'], { queryParams: { Currency: this.AdminCurrency() }, queryParamsHandling: 'merge' })
      this.Joyride.closeTour()
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}



// this.confirmation.confirm({
    //   message: 'Sure, you want to leave the page?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.maskLoad = true;
    //     console.log('Working event')
    //     let userlogout = {
    //       email : this.Cookie.get('emailid'),
    //       logout: false
    //     }
    //     this.ApiData.UserLogout('userlogout', userlogout).subscribe(
    //       res =>{
    //         this.messageService.add({ severity: 'success', summary: `Success`, detail: 'Successfully Logged Out', life: 15000 });
    //         this.Cookie.deleteAll();
    //         this.router.navigate(['/']);
    //         $event.returnValue = false; 
    //         this.maskLoad = false
    //       },
    //       error =>{
    //         this.maskLoad = false
    //         this.messageService.add({ severity: 'error', summary: `Failed`, detail: 'Somthing went wrong', life: 15000 });
    //       }
    //     )
    //   },
    //   reject: () => {
    //     $event.returnValue = false;
    //   }
    // });