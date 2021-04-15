import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray, CdkDragExit, CdkDragEnter} from '@angular/cdk/drag-drop';


interface IEvent {
  logo: string;
  name: string;
  expand: boolean;
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

  EVENT_LIST: IEvent[] = [{
    logo: 'assets/constructor-icons/events/lecture.svg',
    name: 'Лекционное занятие',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/seminar.svg',
    name: 'Семинар',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/exam.svg',
    name: 'Экзамен',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/lab.svg',
    name: 'Лабораторная работа',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/consultation.svg',
    name: 'Консультация',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/coursework.svg',
    name: 'Курсовая работа',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/re-exam.svg',
    name: 'Переэкзаменовка',
    expand: false
  }, {
    logo: 'assets/constructor-icons/events/credit.svg',
    name: 'Зачет',
    expand: false
  }];

  constructor() { }

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

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }

  showEditAddPanel(): void {
    this.editPressed.emit();
  }

  logoutHandler(): void {
    this.logoutPressed.emit();
  }

}
