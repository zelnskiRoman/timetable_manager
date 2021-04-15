import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface IAuth {
  success: boolean;
}

@Component({
  selector: 'app-constructor-page',
  templateUrl: './constructor-page.component.html',
  styleUrls: ['./constructor-page.component.sass']
})
export class ConstructorPageComponent implements OnInit {
  isAuthorise: boolean;
  dragNDropIds: string[];
  showAddEdit: boolean;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.isAuthorise = false;
    this.showAddEdit = false;
  }

  test(value): any {
    this.dragNDropIds = value;
  }

  ngOnInit(): void {
    const CHECK_COOKIE: boolean = this.cookieService.check('_ms_AuthToken');
    if (CHECK_COOKIE) {
      this.httpClient.post(
        'https://mystudyksu.herokuapp.com/check_uuid',
        JSON.stringify({uuid: this.cookieService.get('_ms_AuthToken')})).toPromise()
        .then((res: IAuth) => {
          if (res.success) {
            this.isAuthorise = res.success;
          } else {
            this.router.navigate(['/']);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.router.navigate(['/']);
    }
  }

  onEditPanelClose(): void {
    this.showAddEdit = false;
  }

  onEditPanelOpen(): void {
    this.showAddEdit = true;
  }

  onLogout(): void {
    const CHECK_COOKIE: boolean = this.cookieService.check('_ms_AuthToken');
    if (CHECK_COOKIE) {
      this.cookieService.delete('_ms_AuthToken');
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
