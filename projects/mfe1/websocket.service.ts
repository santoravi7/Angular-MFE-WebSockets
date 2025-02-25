import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket;

  constructor() {
    this.socket = io('ws://localhost:4000'); // Connect to WebSocket server
  }

  getLiveUsers(): Observable<number> {
    return new Observable(observer => {
      this.socket.on('liveUsers', (count: number) => {
        observer.next(count);
      });
    });
  }
}
