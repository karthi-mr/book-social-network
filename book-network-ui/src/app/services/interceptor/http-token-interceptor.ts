import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {Token} from '../token/token';
import {inject} from '@angular/core';

export const httpTokenInterceptor: HttpInterceptorFn =
  (req, next) => {

  const tokenService: Token = inject(Token);
  const token = tokenService.token;

  if (token) {
    const authRequest = req.clone({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    });
    return next(authRequest);
  }
  return next(req);
};
