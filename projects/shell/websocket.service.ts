import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: Socket;
  private userId: string;
  private messages: {user:string,message:string}[]=[];
  private messagesSubject = new BehaviorSubject<{user:string,message:string}[]>(this.messages);

  constructor() {
    this.userId = this.getOrCreateUserId(); // Ensure a single user ID per session
    this.loadMessages();
    this.connect();
  }

  private connect() {
    this.socket = io('ws://localhost:4000', {
      transports: ['websocket'], 
      query: { userId: this.userId } // Send userId to server
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket Server');
    });

    this.socket.on('disconnect', () => {
      console.warn('Disconnected from WebSocket Server');
    });

    this.socket.on('message', (data: any) => {
      console.log('Received message in flights search inside websocket service- ', data);
      this.messages.push({ user: data.user, message: data.message });
      this.saveMessages();
      this.messagesSubject.next([...this.messages]);
    });
  }

  getLiveUsers(): Observable<number> {
    return new Observable(observer => {
      this.socket.on('liveUsers', (count: number) => {
        observer.next(count);
      });
    });
  }

  sendMesssage(user: string,message: string) {
    const messageData = {user,message}
    console.log('Sending message in flights search websocket service - ', messageData);
    this.socket.emit('message', messageData);
  }

  // getMessage(): Observable<any> {
    // return new Observable(observer => {
    //   console.log('Subscribing                    to message event', this.socket);
    //   this.socket.on('message', (data: any) => {
    //     observer.next(data);
    //   });
    // });
  // }
  getMessage(): Observable< { user:string,message: string}[]> {
    console.log('Subscribing to message event', this.messagesSubject.asObservable());
    return this.messagesSubject.asObservable();
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    console.log("User ID: ",userId);
    return userId;
  }

  private saveMessages(){
    localStorage.setItem('messages', JSON.stringify(this.messages));
    console.log("save Messages in websocket service - ",localStorage.getItem('messages')); 
  }

  private loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    const storedUserId = localStorage.getItem('userId');
    console.log("stored Messages - ",storedMessages);
    if(storedMessages) {
      this.messages = JSON.parse(storedMessages);
      this.messagesSubject.next([...this.messages]);
    }
  }
}
