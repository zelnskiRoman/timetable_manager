import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

const REQUEST_URL = '';

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
  private dayList: any;
  private timetableData: any;

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
    this.httpClient.get(
      `${REQUEST_URL}/api/get_user_info`).toPromise()
      .then((res: IAuth) => {
        if (res.success) {
          this.isAuthorise = res.success;
        } else {
          // TODO: сделать нормальный обрабочик
          this.router.navigate(['/']);
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 200) {
          this.isAuthorise = true;
        } else {
          this.router.navigate(['/']);
        }
      });
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

  updateDayList(dayList: any) {
    this.dayList = dayList;
  }

  sendTimeTable(data: any): void {
    this.httpClient.post(`${REQUEST_URL}/api/add_schedule`, JSON.stringify(data)).toPromise()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveTimetable(meta: any): void {
    this.timetableData = meta;
    const resultData = {meta, dayList: this.dayList};
    this.sendTimeTable(resultData);
    console.log(JSON.stringify(resultData));
  }
}
