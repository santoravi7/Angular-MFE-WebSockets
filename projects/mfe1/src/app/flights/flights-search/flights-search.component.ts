import { CommonModule } from '@angular/common';
import {Component, ViewChild, ViewContainerRef, Inject, Injector, ComponentFactoryResolver, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'auth';
import { WebSocketService } from 'projects/shell/websocket.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
// import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flights-search',
  templateUrl: './flights-search.component.html',
  styleUrls: ['./flights-search.component.css']
})
export class FlightsSearchComponent implements OnInit {

  liveUsers: number = 0;
  messages: {user:string, message:string}[] = [];
  private subscription!: Subscription;
  currentUser: string = '';

  @ViewChild('vc', { read: ViewContainerRef, static: true })
  
  viewContainer!: ViewContainerRef;
  
  user:string;
  socket!: Socket;
  newMessage: any = '';

  constructor(
    @Inject(Injector) private injector: Injector,
    @Inject(ComponentFactoryResolver) private cfr: ComponentFactoryResolver,
    authService: AuthService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
    // flightService:FlightService,
  ) { 
    this.user=authService.user;
    
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('userId') || `User${Math.floor(Math.random() * 100)}`;

    console.log("Flights search - ngOnInit",this.webSocketService.getLiveUsers()," - messages = ",this.webSocketService.getMessage());
    
    this.webSocketService.getLiveUsers().subscribe(count => {
      this.liveUsers = count;
      this.cdr.detectChanges();
    });

    this.webSocketService.getMessage().subscribe(data => {
      console.log('Received message in flights search component - ', data);
      this.messages = data;
      // this.messages = [...this.messages, data];
      // this.cdr.detectChanges();
    });
  }

  sendMessage(){
    console.log("Sending message from flights search component - ",this.currentUser," - ",this.newMessage);
    if(this.newMessage.trim()){
      this.webSocketService.sendMesssage(this.currentUser,this.newMessage);
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
     console.log('Unsubscribing from WebSocket');    
      this.subscription.unsubscribe();
    }
  }

  search() {
    alert('Not implemented for this demo!');
  }

  async terms() {
    const comp = await import('../lazy/lazy.component').then(m => m.LazyComponent);

    const factory = this.cfr.resolveComponentFactory(comp);
    this.viewContainer.createComponent(factory, undefined, this.injector);
  }



}
