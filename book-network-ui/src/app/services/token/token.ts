import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Token {
  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(): string {
    return localStorage.getItem('token') as string;
  }

  public isTokenNotValid(): boolean {
    return !this.isTokenValid();
  }

  private isTokenValid(): boolean {
    const token: string = this.token;
    if (!token) {
      localStorage.clear();
      return false;
    }

    // decode the token
    const jwtHelper = new JwtHelperService();
    const isTokenExpired: boolean = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }
    return true;
  }
}
