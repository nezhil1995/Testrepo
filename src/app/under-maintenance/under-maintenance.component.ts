import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import gsap from 'gsap'

@Component({
  selector: 'app-under-maintenance',
  templateUrl: './under-maintenance.component.html',
  styleUrls: ['./under-maintenance.component.css'],
  animations: [
    trigger('rotateAnimation', [
      transition('* => *', [
        style({ transform: 'rotate({{ startRotation }}deg)' }),
        animate('{{ duration }}s', style({ transform: 'rotate({{ endRotation }}deg)' })),
      ]),
    ]),
  ],
})
export class UnderMaintenanceComponent implements AfterViewInit  {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}


      ngAfterViewInit(): void {
        const gearBig = this.elRef.nativeElement.querySelectorAll('.big-gear');
        const gearSmall = this.elRef.nativeElement.querySelectorAll('.small-gear');

        const tlgearBig = gsap.timeline();
        tlgearBig.staggerFromTo(gearBig, 5, {
          transformOrigin: '50% 50%',
          rotation: '0deg'
        }, {
          rotation: '360deg',
          repeat: -1,
          yoyo: false,
          ease: 'linear'
        });

        const tlgearSmall = gsap.timeline();
        tlgearSmall.staggerFromTo(gearSmall, 4, {
          transformOrigin: '50% 50%',
          rotation: '360deg'
        }, {
          rotation: '0deg',
          repeat: -1,
          yoyo: false,
          ease: 'linear'
        });
      }

}
