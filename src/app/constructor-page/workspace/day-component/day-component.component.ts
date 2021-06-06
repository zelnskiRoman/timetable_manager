import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {EVENT_ICONS, formatTutorName, printGroups} from '../../../utils';
import {IGroup} from '../../add-edit/utils/interfaces';

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
export class DayComponentComponent implements OnChanges {

  @Input() id: string;
  @Input() title: string;
  @Input() week: number;
  @Input() otherCardsUuid: string[];
  @Input() loadedDays: any;
  @Input() selectedGroup: IGroup;

  @Output() eventAdded = new EventEmitter<IChangedEvent>();
  @Output() eventDeleted = new EventEmitter<any>();

  dayEvents: IEvent[] = [];
  formatTeacherName = formatTutorName;
  resolveGroup = printGroups;
  ICONS_LIST = EVENT_ICONS;
  currentGroup: IGroup;

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
    const deletedEvent = this.dayEvents.splice(this.dayEvents.indexOf(i), 1);
    this.eventDeleted.emit(deletedEvent);
    this.eventListChanged();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (changes.selectedGroup && changes.selectedGroup.currentValue &&
            changes.selectedGroup.currentValue.title !== this.currentGroup) {
      this.dayEvents = [];
    }

    if (changes.selectedGroup && changes.selectedGroup.currentValue) {
      this.currentGroup = changes.selectedGroup.currentValue;
    }

    if (changes.loadedDays && changes.loadedDays.currentValue) {
      for (const day of changes.loadedDays.currentValue) {
        if (day.cardTitle === this.title && +day.week === this.week) {
          this.dayEvents = day.eventList.concat();
          this.eventListChanged();
        }
      }

      if (changes.loadedDays.currentValue.length === 0) {
        this.dayEvents = [];
      }
    }
  }
}
