import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { debug } from 'util';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  authenticatedUserToken: string;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.subscribe(user => this.authenticatedUserToken = user && user.jwt);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authenticatedUserToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.authenticatedUserToken}`)
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }

}
