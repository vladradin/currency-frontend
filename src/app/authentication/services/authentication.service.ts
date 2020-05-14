import { Injectable } from '@angular/core';

import { UserCredentials, User, Token } from 'src/app/users/models/user';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { mapToFriendlierName } from 'src/app/shared/utils';

@Injectable()
export class AuthenticationService extends BehaviorSubject<User> {

  constructor(private httpClient: HttpClient) {
    super(undefined);
  }

  public login(userCredentials: UserCredentials) {
    return this.httpClient.post<Token>('/api/authentication/signin', userCredentials)
      .pipe(
        tap(token => this.onAuthenticationSuccesfully(token, userCredentials)),
        catchError(error => throwError(mapToFriendlierName(error)))
      );
  }

  onAuthenticationSuccesfully(token: Token, userCredentials: UserCredentials): void {
    this.next({
      username: userCredentials.username,
      jwt: token.value,
    });
  }

  public logout() {
    this.next(null);
  }
}
