import {Injectable} from '@angular/core';

import {Observable} from "rxjs/Observable";

import {LoginCommand, IdentityService, User, Name, LocalStorage, AUTH_TOKEN_NAME} from './index';
import {ExtHttp} from '../shared';

import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class LoginService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http:ExtHttp, private identityService:IdentityService, private storage:LocalStorage) {
  }

  login(command:LoginCommand):Observable<User> {

    return Observable.create((observer) => {
      const body = {
        username: command.username,
        password: command.password
      };

      this.http.post('/auth/login', body).subscribe((response) => {
        const token = response.json();
        observer.next(this.loadUser(token));
      });
    });
  }

  public loadUser(token:string):User {
    const userToken = this.jwtHelper.decodeToken(token);

    const name = new Name(userToken.firstName, userToken.lastName);
    const user = new User(name, true, token);

    this.storage.setItem(AUTH_TOKEN_NAME, token);
    this.identityService.update(user);
    return user;
  }

}
