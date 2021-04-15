import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

interface IAuth {
  success: boolean;
}

interface IAuthResult {
  success: boolean;
  uuid: string;
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
      'https://mystudyksu.herokuapp.com/autorize',
      JSON.stringify({login, password})).toPromise()
      .then((res: IAuthResult) => {
        if (res.success) {
          this.cookieService.set('_ms_AuthToken', res.uuid);
          this.router.navigate(['/constructor']);
          this.cookieSet = true;
        } else {
          this.showFormLoading = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnInit() {
    const COOKIE_SET = this.cookieService.check('_ms_AuthToken');
    if (COOKIE_SET) {
      this.httpClient.post(
        'https://mystudyksu.herokuapp.com/check_uuid',
        JSON.stringify({uuid: this.cookieService.get('_ms_AuthToken')})).toPromise()
        .then((res: IAuth) => {
          if (res.success) {
            this.router.navigate(['/constructor']);
          } else {
            this.cookieSet = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.cookieSet = true;
    }
  }
}
