import { Injectable } from '@angular/core';
import { CanLoad, Route, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class IsAuthenticatedGuard implements CanLoad, CanActivate {

  isAuthenticated = false;

  constructor(private authenticationSvc: AuthenticationService) {
    this.authenticationSvc.subscribe(user => this.isAuthenticated = !!user);
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated;
  }

  canLoad(route: Route) {
    return this.isAuthenticated;
  }
}
