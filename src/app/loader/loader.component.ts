import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { interval } from 'rxjs';
import { TweenMax, Power2 } from 'gsap';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements AfterViewInit {

  @ViewChild('tipContainer') tipElement!: ElementRef;

  TipsArray: string[] = [
    "A single⚡lightning bolt unleashes 5 times more heat than the sun ☀️", 
    "60 minutes of solar energy could power the 🌏 Earth for a year ",
    "10 Google searches can power a 60-watt lightbulb 💡",
    "The 📰 word 'energy' is derived from ancient Greece",
    "A single wind turbine can power 1400 🏠 homes",
    "💧Water has a high carbon footprint"
  ];

  currentTip = '';
  currentTipIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  displayNextTip() {
    const randomIndex = Math.floor(Math.random() * this.TipsArray.length);
    this.currentTip = this.TipsArray[randomIndex];
    this.cdr.detectChanges();
  }

  animateTips() {
    TweenMax.set(this.tipElement.nativeElement, { opacity: 0 });
    const fadeIn = () => {
      TweenMax.to(this.tipElement.nativeElement, 1, { opacity: 1, ease: Power2.easeInOut, onComplete: fadeOut, delay: 0.5 });
    };
    const fadeOut = () => {
      TweenMax.to(this.tipElement.nativeElement, 1, { opacity: 0, delay: 3.0, ease: Power2.easeInOut, onComplete: nextTip });
    };
    const nextTip = () => {
      this.displayNextTip();
      fadeIn();
    };
    fadeIn();
  }

  ngAfterViewInit(): void {
    this.displayNextTip();
    this.animateTips();
  }

}
