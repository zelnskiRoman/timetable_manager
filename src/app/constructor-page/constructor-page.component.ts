import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {IGroup} from './add-edit/utils/interfaces';
import { v4 as uuidv4 } from 'uuid';

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
  showGlobalLoading: boolean;
  daysList: any = [];
  weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  weeksCount = 2;
  ids: string[];
  loadedTimetable: any;
  deletedEvents: any;
  selectedGroup: IGroup;
  private dayList: any;
  private timetableData: any;

  @Output() dayListUpdated = new EventEmitter<any>();


  constructor(
    private cookieService: CookieService,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.isAuthorise = false;
    this.showAddEdit = false;
    this.showGlobalLoading = false;
    this.ids = this.generateDayIds();
    this.dragNDropIds = this.ids;
    this.deletedEvents = [];
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
    this.daysList.forEach((el) => {
      el.eventList = el.eventList.filter((event) => !event.loaded);
    });
    const resultData = {meta, dayList: this.daysList, deletedEvents: this.deletedEvents};
    this.sendTimeTable(resultData);
    console.log(JSON.stringify(resultData));
  }

  generateDayIds(): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < this.weeksCount * 7; i++) {
      uuids.push(uuidv4());
    }
    return uuids;
  }

  getOtherCardsUuid(cardUuid: string): string[] {
    return this.ids.filter((el) => {
      return el !== cardUuid;
    });
  }

  updateDaysList(event): any {
    let uniqDay = true;
    this.daysList.map((el) => {
      if (el.cardId === event.cardId) {
        uniqDay = false;
        return event;
      }
    });
    if (uniqDay) {
      this.daysList.push(event);
    }
    this.dayList = this.daysList;
  }

  deleteEventHandler(event: any): void {
    if (event[0] && event[0].loaded) {
      this.deletedEvents.push(event[0]);
    }
  }

  groupSelectedHandler(group: IGroup): void {
    this.selectedGroup = group;
    this.showGlobalLoading = true;
    this.daysList = [];
    this.deletedEvents = [];
    this.httpClient.post(`${REQUEST_URL}/api/get_schedule`, JSON.stringify({id: group.title})).toPromise()
      .then((res) => {
        this.loadedTimetable = res;
        this.showGlobalLoading = false;
      })
      .catch((err) => {
        this.showGlobalLoading = false;
        console.log(err);
      });
  }
}
