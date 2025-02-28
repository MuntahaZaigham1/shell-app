import { isPlatformBrowser } from '@angular/common';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {


  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Only attach listener in the shell
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('childRouteChanged', (event: any) => this.changeRoute(event));
    }
  }

  // Method to be called from remote to navigate
  navigateFromRemote(remoteName: string, route: string) {
    const routeChangeEvent = new CustomEvent('childRouteChanged', {
      detail: {
        remoteName,
        routeName: route
      }
    });

    window.dispatchEvent(routeChangeEvent);
  }

  // Handle route change in the shell
  private changeRoute(event: any) {
    if (event.detail && event.detail.routeName) {
      this.router.navigate([event.detail.routeName]);
    }
  }


  // navigate() {
  //   const routeChangeEvent = new CustomEvent('childRouteChanged', {
  //     data: {
  //       remoteName: 'myRemote',
  //       routeName: 'myRemote/list' + this.id
  //     },
  //   });

  //   window.dispatchEvent(routeChangeEvent);
  // }


  // @HostListener('window.childRouteChanged', ['&event'])
  // changeRoute(event) {
  //   this.router.navigate([event.data.routeName])
  // }

}
