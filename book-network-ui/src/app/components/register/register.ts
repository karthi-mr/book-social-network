import { Component } from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {ApiConfiguration} from '../../services/api-configuration';
import {register} from '../../services/functions';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  protected registerRequest: RegistrationRequest = {
    email: '',
    firstname: '',
    lastname: '',
    password: ''
  }

  protected errorMsg: Array<string> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiConfig: ApiConfiguration
  ) {
  }

  registerUser() {
    this.errorMsg = [];
    register(
      this.http,
      this.apiConfig.rootUrl,
      {
        body: this.registerRequest
      }
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['activate-account']);
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error:", err);

        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }

  login() {
    this.router.navigate(['login']);
  }
}
