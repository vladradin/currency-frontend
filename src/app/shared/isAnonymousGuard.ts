import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication/services';

@Injectable()
export class IsAnonymousGuard implements CanActivate {
  isAuthenticated = false;
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.subscribe(user => this.isAuthenticated = !!user);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return !this.isAuthenticated;
  }
}
