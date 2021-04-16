import { Component, Input, Output, EventEmitter } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';


interface IEvent {
  logo: string;
  name: string;
  type: string;
  details: object;
}

interface IMeta {
  organisationId: string;
  universityId: string;
  groupId: string;
}

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.sass']
})
export class ConstructorComponent {

  @Input() ids: string[] = [];
  @Output() editPressed = new EventEmitter<void>();
  @Output() logoutPressed = new EventEmitter<void>();
  @Output() timetableSaved = new EventEmitter<IMeta>();
  organisationId = 'ooooo-ooooo-ooooo';
  universityId = 'yyyyy-yyyyy-yyyyy';
  groupId = 'ggggg-ggggg-ggggg';
  eventSettings: any = {
    lessonTitle: Math.random() > .5 ? 'Web-программирование' : 'Управление базами данных',
    tutor: Math.random() < .5 ? 'Зеленский Р.В.' : 'Прядкина Н.О.',
    address: Math.random() > .5 ? 'Дзержинского, 17' : 'Малышковская, 4E',
    class: Math.random() < .5 ? '320' : '210',
    groups: Math.random() > .5 ? ['a'] : ['a', 'b'],
    time: '10:00 - 11:40'
  };
  EVENT_LIST: IEvent[];

  constructor() {
    this.EVENT_LIST = this.fillEventsList();
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  noReturnPredicate() {
    return false;
  }

  showEditAddPanel(): void {
    this.editPressed.emit();
  }

  logoutHandler(): void {
    this.logoutPressed.emit();
  }

  fillEventsList(): IEvent[] {
    return [{
      logo: 'assets/constructor-icons/events/lecture.svg',
      name: 'Лекционное занятие',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/seminar.svg',
      name: 'Семинар',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/exam.svg',
      name: 'Экзамен',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/lab.svg',
      name: 'Лабораторная работа',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/consultation.svg',
      name: 'Консультация',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/coursework.svg',
      name: 'Курсовая работа',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/re-exam.svg',
      name: 'Переэкзаменовка',
      type: uuidv4(),
      details: this.eventSettings
    }, {
      logo: 'assets/constructor-icons/events/credit.svg',
      name: 'Зачет',
      type: uuidv4(),
      details: this.eventSettings
    }];
  }

  saveTimetable(): void {
    this.timetableSaved.emit({
      organisationId: this.organisationId,
      universityId: this.universityId,
      groupId: this.groupId
    });
  }

}
