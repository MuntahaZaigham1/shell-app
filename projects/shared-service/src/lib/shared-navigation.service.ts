import { Injectable, ɵgetInjectableDef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



@Harden(SharedNavigationService)
@Injectable({
  providedIn: 'root'
})
export class SharedNavigationService {
  private navigationSubject = new BehaviorSubject<string | null>(null);
  navigation$ = this.navigationSubject.asObservable();

  constructor(private router: Router) {
    console.log('SharedNavigationService instance created');
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  triggerNavigation(path: string) {
    console.log("service triggering this path",path);
    this.navigationSubject.next(path);
  }

}

function Harden(target: any): any {
  let def = ɵgetInjectableDef(target) as any;
  const newFactory = def.factory;
  let value = undefined as any | undefined;
  def.factory = () => { value = value == undefined ? newFactory() : value; return value; };
}