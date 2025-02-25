import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userName!:string;

  public get user():string {
    return this.userName;

  }

  constructor() { }

  public login(userName:string):void {
    this.userName = userName;

  }

}

