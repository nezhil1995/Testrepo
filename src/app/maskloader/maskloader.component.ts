import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-maskloader',
  templateUrl: './maskloader.component.html',
  styleUrls: ['./maskloader.component.css']
})
export class MaskloaderComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    
  }
}
