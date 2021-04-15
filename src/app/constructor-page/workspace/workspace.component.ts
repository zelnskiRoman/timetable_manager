import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.sass']
})
export class WorkspaceComponent implements OnInit {

  daysList: any = [];
  weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  weeksCount = 2;
  ids: string[];

  @Output() idValues = new EventEmitter<any>();
  constructor() {
    this.ids = this.generateDayIds();
  }

  ngOnInit(): void {
    this.idValues.emit(this.ids);
  }

  generateDayIds(): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < this.weeksCount * 7; i++) {
      uuids.push(uuidv4());
    }
    return uuids;
  }

  updateDaysList(event): any {
    let uniqDay: boolean = true;
    this.daysList.map((el) => {
      if (el.cardId === event.cardId) {
        uniqDay = false;
        return event;
      }
    });
    if (uniqDay) {
      this.daysList.push(event);
    }
    console.log(this.daysList);
  }

  getOtherCardsUuid(cardUuid: string): string[] {
    return this.ids.filter((el) => {
      return el !== cardUuid;
    });
  }
}
