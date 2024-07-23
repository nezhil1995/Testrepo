import { Component, ElementRef, Renderer2, ChangeDetectorRef, DoCheck  } from '@angular/core';
import { sideData, CorpadminNavData, ClusadminNavData, SupClusadminNavData } from './data';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { DashboardService } from '../dashboard/dashboard.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})


export class SidebarComponent implements DoCheck {

  navdata = sideData;
  user = this.Cookie.get('type')
  AuthUser = this.Cookie.get('Auth_Admin')

  routerPassto = ''

  getQueryparams(link:any){
    if(link === 'cluster-analytics' || link === 'analytics' || link === 'clusterhead-dashboard'){
      return  {
        Currency : this.Cookie.get('Currency_code')
      }
    }
    else {
      return {}
    }
    
  }

  constructor( private router: Router,private Cookie: CookieService, private changeDetectorRef: ChangeDetectorRef, private messageService: MessageService, private routerlocation: Location, private Logout: DashboardService, private confirmation: ConfirmationService) 
  {

    switch(this.user){
      case 'CORPORATE-ADMIN': this.navdata = CorpadminNavData 
        break;
      case 'CLUSTER-ADMIN': this.navdata = ClusadminNavData 
        break;
      case 'SUPERCLUSTER-ADMIN': this.navdata = SupClusadminNavData
        break;
      case 'BASE-ADMIN': this.navdata = sideData 
        break;
      case 'BASE-USER': this.navdata = sideData 
        break;
    }
  }

  ngDoCheck() {
    const newUser = this.Cookie.get('type');
    if (newUser !== this.user) {
      this.user = newUser;
      this.updateSidebar();
    }
  }

  updateSidebar() {
    switch (this.user) {
      case 'CORPORATE-ADMIN':
        this.navdata = CorpadminNavData;
        break;
      case 'CLUSTER-ADMIN':
        this.navdata = ClusadminNavData;
        break;
      case 'SUPERCLUSTER-ADMIN':
        this.navdata = SupClusadminNavData;
        break;
      case 'BASE-ADMIN':
      case 'BASE-USER':
        this.navdata = sideData;
        break;
    }

    // Manually trigger change detection
    this.changeDetectorRef.detectChanges();
  }

  maskLoad:boolean = false
  timer: any;
  isRunning: boolean = false;

  ngOnDestroy(): void {
    this.stopTimer();
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.isRunning = false;
  }

  ClickLogout(){
    this.confirmation.confirm({
      message: 'Sure, you want to Logout?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.maskLoad = true
        this.logout();
      }
    });
  }

  logout() {
    let payload = {
      email: this.Cookie.get('emailid')
    }
    this.Logout.UserLogout('userlogout', payload).subscribe(
      res=>{
        this.stopTimer();
        localStorage.removeItem('timerStartTime');
        this.messageService.add({ severity: 'success', summary: `Success`, detail: 'Successfully Logged Out', life: 15000 });
        this.Cookie.deleteAll();
        this.Cookie.set('plantname', 'null')
        this.router.navigate(['/']).then(() => {
          this.routerlocation.replaceState(this.router.url);
          window.location.reload();
        });
        this.maskLoad = false
      },
      error=>{
        this.maskLoad = false
        this.messageService.add({ severity: 'error', summary: `Error`, detail: 'Something went wrong', life: 15000 });
      }
    )
  }



}
