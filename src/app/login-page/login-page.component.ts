import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

const REQUEST_URL = '';

interface IAuth {
  success: boolean;
}

interface IAuthResult {
  success: boolean;
  session: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})

export class LoginPageComponent implements OnInit {
  showFormLoading: boolean;
  cookieSet: boolean;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.showFormLoading = false;
    this.cookieSet = false;
  }

  auth(login: string, password: string): void {
    this.showFormLoading = true;
    this.httpClient.post(
      `${REQUEST_URL}/api/auth/login`,
      JSON.stringify({login, password})).toPromise()
      .then((res: IAuthResult) => {
        if (res.success) {
          this.cookieService.set('_ms_AuthToken', res.session);
          this.router.navigate(['/constructor']);
          this.cookieSet = true;
        } else {
          this.showFormLoading = false;
        }
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  ngOnInit() {
    this.httpClient.get(`${REQUEST_URL}/api/get_user_info`).toPromise()
      .then((res: {success: boolean}) => {
        if (res.success) {
          this.router.navigate(['/constructor']);
        }
      })
      .catch((err: HttpErrorResponse) => {
        this.cookieSet = true;
      });
  }
}
