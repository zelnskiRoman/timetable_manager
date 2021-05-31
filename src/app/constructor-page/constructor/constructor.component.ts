import {Component, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {IDirection, IGroup, IUniversity} from '../add-edit/utils/interfaces';
import {HttpClient} from '@angular/common/http';


interface IEvent {
  logo: string;
  name: string;
  type: string;
  details: object;
}

interface IMeta {
  organisationId: string;
  universityId: string;
  group: string;
}

interface IModalWindowOptions {
  requestedUrl: string;
  inputPlaceholder: string;
  postParams?: object;
  getParams?: {};
  addButton?: boolean;
  // tslint:disable-next-line:ban-types
  addButtonHandler?: Function;
  selectedItems?: any;
  multiSelect: boolean;
  target?: string;
}

interface ISelectList {
  source: string;
  addSource?: string;
  inputPlaceholder: string;
  emptyMessage: string;
  getParams?: {};
  postParams?: object;
  addButton: boolean;
  addMasterTemplate?: TemplateRef<any>;
  multiSelection?: boolean;
  masterItemTemplate?: TemplateRef<any>;
  detailsItemTemplate?: TemplateRef<any>;
  allowLoadDetailsIds?: string[];
}
interface ITwoListSelectOptions {
  master: ISelectList;
  details: ISelectList;
  target?: string;
}

enum ModalTarget {
  university = 'university',
  direction = 'direction',
  group = 'group'
}

enum TwoModalTarget {
  lesson = 'lesson',
  adress = 'adress',
  groups = 'lessonGroups'
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

  showModalDialog = false;
  showTwoSelectModal = false;
  modalOptions: IModalWindowOptions;
  twoSelectOptions: ITwoListSelectOptions;

  timetableSettings: any;
  disableDragNDrop = true;

  organisationId = 'fb2cad60-13f4-4940-95dd-5a43081a0f31';
  universityId: IUniversity;
  direction: IDirection;
  group: IGroup;
  lesson: any;
  address: any;
  lessonGroups: any;
  eventSettings: any = {
    lessonTitle: Math.random() > .5 ? 'Web-программирование' : 'Управление базами данных',
    tutor: Math.random() < .5 ? 'Зеленский Р.В.' : 'Прядкина Н.О.',
    address: Math.random() > .5 ? 'Дзержинского, 17' : 'Малышковская, 4E',
    class: Math.random() < .5 ? '320' : '210',
    groups: Math.random() > .5 ? ['a'] : ['a', 'b'],
    time: '10:10 - 11:40'
  };
  EVENT_LIST: IEvent[];

  constructor(
    // TODO: Нужно?
    private httpClient: HttpClient
  ) {
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

  showModalWindow(options: IModalWindowOptions): void {
    switch (options.target) {
      case ModalTarget.university:
        break;
      case ModalTarget.direction:
        if (this.universityId) {
          break;
        } else {
          return;
        }
      case ModalTarget.group:
        if (this.direction) {
          break;
        } else {
          return;
        }
    }
    this.modalOptions = options;
    this.showModalDialog = true;
  }

  hideWindowClose(selectedItems: any): void {
    if (selectedItems) {
      switch (selectedItems.target) {
        case ModalTarget.university:
          if (this.universityId && selectedItems.selectedItems.id !== this.universityId.id) {
            this.direction = null;
            this.group = null;
          }
          this.universityId = selectedItems.selectedItems;
          break;
        case ModalTarget.direction:
          if (this.direction && selectedItems.selectedItems.id !== this.direction.id) {
            this.group = null;
          }
          this.direction = selectedItems.selectedItems;
          break;
        case ModalTarget.group:
          this.group = selectedItems.selectedItems;
      }
    }
    this.clearAllEventSettings();
    this.checkDragNDropPermisson();
    this.modalOptions = null;
    this.showModalDialog = false;
  }

  showTwoSelect(options: ITwoListSelectOptions): void {
    this.twoSelectOptions = options;
    this.showTwoSelectModal = true;
  }

  closeTwoSelect(result: any): void {
    if (result) {
      switch (result.target) {
        case TwoModalTarget.lesson:
          this.lesson = {
            lesson: result.master,
            tutor: result.details
          };
          break;
        case TwoModalTarget.adress:
          this.address = {
            address: result.master,
            audition: result.details
          };
          break;
        case TwoModalTarget.groups:
          this.lessonGroups = {
            groups: result.master,
            subgroup: result.details
          };
          break;
      }
      this.updateEventSettings();
      this.checkDragNDropPermisson();
    }
    this.showTwoSelectModal = false;
  }

  updateEventSettings(): void {
    this.eventSettings.lesson = this.lesson ? this.lesson.lesson[0] : null;
    this.eventSettings.tutor = this.lesson ? this.lesson.tutor[0] : null;
    this.eventSettings.address = this.address ? this.address.address[0] : null;
    this.eventSettings.class = this.address ? this.address.audition[0] : null;
    this.eventSettings.groups = this.lessonGroups ? this.lessonGroups : null;
  }

  logoutHandler(): void {
    this.logoutPressed.emit();
  }

  fillEventsList(): IEvent[] {
    return [{
      logo: 'assets/constructor-icons/events/lecture.svg',
      name: 'Лекционное занятие',
      type: '4c76f7b3-1d15-447a-9833-e6ed40841946',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/seminar.svg',
      name: 'Семинар',
      type: 'd871af62-9960-45f7-8b10-2e67481adaa9',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/exam.svg',
      name: 'Экзамен',
      type: '1e003a80-87fe-4653-84b6-875b46a5bb0d',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/lab.svg',
      name: 'Лабораторная работа',
      type: '5d4b334e-61f7-447e-809f-e0d9d256c7f4',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/consultation.svg',
      name: 'Консультация',
      type: '8a2c99af-076d-49b9-aad5-b9cd27b6d3ac',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/coursework.svg',
      name: 'Курсовая работа',
      type: '5c169666-fe63-4dd1-9508-b83ff870c3c5',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/re-exam.svg',
      name: 'Переэкзаменовка',
      type: '210c17b9-44ac-4635-87c5-4fbfd3ccfa3a',
      details: Object.assign({}, this.eventSettings)
    }, {
      logo: 'assets/constructor-icons/events/credit.svg',
      name: 'Зачет',
      type: 'd526c0a1-5265-4d7a-936c-67c8cfe32abe',
      details: Object.assign({}, this.eventSettings)
    }];
  }

  checkDragNDropPermisson(): void {
    this.disableDragNDrop = !(this.organisationId &&
      this.universityId &&
      this.group &&
      this.lesson &&
      this.direction &&
      this.lessonGroups &&
      this.address);
    if (!this.disableDragNDrop) {
      this.EVENT_LIST = this.fillEventsList();
    }
  }

  clearAllEventSettings(): void {
    this.lesson = null;
    this.address = null;
    this.lessonGroups = null;
  }

  updateSettings(): IMeta {
    return {
      organisationId: this.organisationId,
      universityId: this.universityId.id,
      group: this.group.title
    };
  }

  saveTimetable(): void {
    this.timetableSaved.emit(this.updateSettings());
  }

  getTimetable(): void {
    this.httpClient.post('/api/get_schedule', JSON.stringify({id: this.group.title})).toPromise()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
