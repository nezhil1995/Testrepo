import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-try-again',
  templateUrl: './try-again.component.html',
  styleUrls: ['./try-again.component.css']
})
export class TryAgainComponent implements OnInit  {

  @Input() Message:string = 'No data Avilable'
  @Output() ClicktryAgain: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
      
  }

  tiggeFunctionCom(){
    this.ClicktryAgain.emit()
  }

}
