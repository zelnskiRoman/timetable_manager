import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.sass']
})
export class WorkspaceComponent implements OnInit {
  dateRange = [17, 23, 35, 46, 58, 60, 75];
  weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  ids = ['Понедельник1', 'Вторник2', 'Среда3', 'Четверг4', 'Пятница5', 'Суббота6'];

  @Output() idValues = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    this.idValues.emit(this.ids);
  }

  test(event): any {
    console.log(event);
  }

}
