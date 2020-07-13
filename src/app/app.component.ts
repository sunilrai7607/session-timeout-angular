import { Component, HostListener, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { Subscription, timer } from 'rxjs';
import {take,takeUntil} from 'rxjs/operators'
import { EventHubService, ISubjectEvent } from './event-hub.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  seconds: any;
  minutes: any;
  visible: boolean; // show / hode popup
  stopHostListener: boolean; // stope detecting keypad, click or any changes when popup is opened
  sessionMsg: string;

  constructor(private eventHubService:EventHubService){

    //listener to start timer from a different componnet or service
    this. eventHubService.listen('startTimer').subscribe((result: ISubjectEvent<boolean>) =>{
      console.log(result.data, result.name);
      this.startTimer();
    })

  }
  ngOnInit(): void {
    this.startTimer();
  }


  timerSubscription:Subscription;
  title = 'session-timeout';

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:wheel', ['$event'])
  resetTimer():void {
    console.log('inside timerx')
    if(!this.stopHostListener){
      this.startTimer();
    }

  }

startTimer(endTime:number= 1){
const interval = 1000;
const duration= endTime *1 * 60;
this.timerSubscription = timer(0,interval).pipe(take(duration)).subscribe(value => this.renderUi((duration - +value) * interval))
  }

renderUi(count:number): void{
this.seconds = this.pad(((count % 60000)/1000).toFixed(0));
this.minutes = this.pad(Math.floor(count/60000));
console.log(this.seconds  , this.minutes)
if(this.seconds.toString()==='50' && this.minutes.toString()==='00'){

this.sessionMsg =''
this.visible =true;   //open popup
this.stopHostListener =true; 

}

if(this.seconds.toString()==='01' && this.minutes.toString()==='00'){
  this.visible =false; //close popup
  this.stopTimer(); // stop timer
  this.sessionMsg= "session cancelled";
}

  }

  stopTimer():void {
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
  }

  pad(digit){
    return digit <= 9 ? '0' + digit:digit;
  }

  /*
  * extending session by restarting timer
  */
  extendSession(){
    this.visible =false; // close doalog and extend session
    this.sessionMsg= "session extended";
    this.stopTimer(); // stop timer to extend session

    this.stopHostListener =false;
  }

  
  sendEvent(){
    const eventData:ISubjectEvent<boolean> ={
      name: 'startTimer',
      data: true
    }
    this.eventHubService.notify(eventData); //dispath event to start timer from any component or service
  }
}
