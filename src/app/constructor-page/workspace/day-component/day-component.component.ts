import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {formatTutorName} from '../../../utils';

interface IEvent {
  logo: string;
  name: string;
}

interface IChangedEvent {
  cardId: string;
  cardTitle: string;
  week: number;
  eventList: IEvent[];
}

@Component({
  selector: 'app-day-component',
  templateUrl: './day-component.component.html',
  styleUrls: ['./day-component.component.sass']
})
export class DayComponentComponent {

  @Input() id: string;
  @Input() title: string;
  @Input() week: number;
  @Input() otherCardsUuid: string[];
  @Output() eventAdded = new EventEmitter<IChangedEvent>();

  dayEvents: IEvent[] = [];
  formatTeacherName = formatTutorName;

  constructor() { }

  /**
   * Card event list changed handler
   * @handler
   */
  eventListChanged(): void {
    this.eventAdded.emit({
      cardId: this.id,
      cardTitle: this.title,
      week: this.week,
      eventList: this.dayEvents
    });
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.eventListChanged();
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.eventListChanged();
    }

    if (event.previousContainer.id === 'never-true') {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  doubleClickHandler(elem, i): any {
    this.dayEvents.splice(i, 1);
    this.eventListChanged();
  }

}
