import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';

interface IEvent {
  logo: string;
  name: string;
  expand: boolean;
}

@Component({
  selector: 'app-day-component',
  templateUrl: './day-component.component.html',
  styleUrls: ['./day-component.component.sass']
})
export class DayComponentComponent implements OnInit {

  @Input() id: string;
  @Input() title: string;

  EVENTS: IEvent[] = [];

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

  doubleClickHandler(elem, i): any {
    this.EVENTS.splice(i, 1);
  }

  ngOnInit(): void {
  }

}
