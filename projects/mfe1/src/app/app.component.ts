import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebSocketService } from 'projects/shell/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{
  liveUsers: number = 0;
  subscription!: Subscription;
  messages:{user:string, message:string}[] = [];
  constructor(private wsService: WebSocketService, private cdr: ChangeDetectorRef) {}
  currentUser: string = '';

  ngOnInit() {
    this.currentUser = localStorage.getItem('username') || `User${Math.floor(Math.random() * 100)}`;

    this.wsService.getLiveUsers().subscribe(count => {
      this.liveUsers = count;
      this.cdr.detectChanges();  // ✅ Force UI update
    });
  }
  sendMessage(){
    console.log("Sending message in flights search - ",this.liveUsers);
    this.wsService.sendMesssage(this.currentUser,'User searched from Flights');
  }

  ngOnDestroy() {
    if (this.subscription) {
     console.log('Unsubscribing from WebSocket');    
      this.subscription.unsubscribe();
    }
  }
}
