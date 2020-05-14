import { Injectable } from '@angular/core';
import { UserRegistrationInfo } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { mapToFriendlierName } from 'src/app/shared/utils';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }
  registerUser(userRegistration: UserRegistrationInfo) {
    return this.http.post<string>('api/users/register', userRegistration)
      .pipe(
        catchError(val => throwError(mapToFriendlierName(val)))
      );
  }
}
