import { Injectable, ɵgetInjectableDef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



@Harden(SharedAuthenticationService)
@Injectable({
  providedIn: 'root'
})
export class SharedAuthenticationService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$ = this.authTokenSubject.asObservable();

  constructor() {
    console.log('SharedAuthenticationService instance created');
  }

  sendAuthToken(token: string | null) {
    console.log("token sent through service")
    this.authTokenSubject.next(token);
  }
  
  getAuthToken() {
    console.log("token recieved through service")
    return this.authToken$;
  }
}

function Harden(target: any): any {
  let def = ɵgetInjectableDef(target) as any;
  const newFactory = def.factory;
  let value = undefined as any | undefined;
  def.factory = () => { value = value == undefined ? newFactory() : value; return value; };
}