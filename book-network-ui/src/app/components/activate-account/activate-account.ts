import { Component } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {CodeInputModule} from 'angular-code-input';
import {activateAccount} from '../../services/functions';
import {ApiConfiguration} from '../../services/api-configuration';

@Component({
  selector: 'app-activate-account',
  imports: [
    CodeInputModule
  ],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.scss'
})
export class ActivateAccount {

  protected message: string = '';
  protected isOkay: boolean = true;
  protected submitted: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiConfig: ApiConfiguration
  ) {
  }


  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  protected redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string) {
    activateAccount(
      this.http,
      this.apiConfig.rootUrl,
      {
        token: token
      }
    ).subscribe({
      next: () => {
        console.log('Activation completed');
        this.message = 'Your account has been successfully activated.\nNow you can proceed to Login';
        this.isOkay = true;
        this.submitted = true;
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error: ', err);
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      },
    });
  }
}
