import {Component} from '@angular/core';
import {AuthenticationRequest} from '../../services/models/authentication-request';
import {FormsModule} from '@angular/forms';
import {authenticate} from '../../services/functions';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiConfiguration} from '../../services/api-configuration';
import {Token} from '../../services/token/token';
import {AuthenticationResponse} from '../../services/models/authentication-response';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiConfig: ApiConfiguration,
    private token: Token
  ) {
  }

  login() {
    this.errorMsg = [];
    authenticate(
      this.http,
      this.apiConfig.rootUrl,
      {body: this.authRequest},
    ).subscribe({
      next: (res: HttpResponse<AuthenticationResponse>) => {
        // this.token.token = res.token as string;
        console.log(res.body?.token);
        this.token.token = res.body?.token as string;
        this.router.navigate(['books']);
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error: ', err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
