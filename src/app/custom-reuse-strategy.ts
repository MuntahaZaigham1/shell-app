import { ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean { return false; }
  store(): void { }
  shouldAttach(): boolean { return false; }
  retrieve(): any { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
