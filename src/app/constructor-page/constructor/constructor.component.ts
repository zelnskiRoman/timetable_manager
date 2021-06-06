import {Component, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {IDirection, IGroup, IUniversity} from '../add-edit/utils/interfaces';
import {HttpClient} from '@angular/common/http';
import {EVENT_ICONS, printGroups} from '../../utils';


interface IEvent {
  logoType: number;
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
  selectedItem?: any;
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
  @Output() groupSelected = new EventEmitter<any>();

  ICONS_LIST = EVENT_ICONS;

  showModalDialog = false;
  showTwoSelectModal = false;
  showAddEventModal = false;
  modalOptions: IModalWindowOptions;
  twoSelectOptions: ITwoListSelectOptions;

  timetableSettings: any;
  disableDragNDrop = true;

  resolveGroup = printGroups;
  organisationId = 'fb2cad60-13f4-4940-95dd-5a43081a0f31';
  universityId: IUniversity;
  direction: IDirection;
  group: IGroup;
  lesson: any;
  address: any;
  lessonGroups: any;
  timeStart: string;
  timeEnd: string;
  eventSettings: any = {
    lessonTitle: undefined,
    tutor: undefined,
    address: undefined,
    class: undefined,
    groups: undefined,
    time: undefined
  };
  EVENT_LIST: IEvent[];

  constructor(
    // TODO: Нужно?
    private httpClient: HttpClient
  ) {
    this.getEventTypes();
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
          this.groupSelected.emit(this.group);
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
    this.eventSettings.time = {
      start: this.timeStart,
      end: this.timeEnd
    };
  }

  logoutHandler(): void {
    this.logoutPressed.emit();
  }

  checkDragNDropPermisson(): void {
    this.disableDragNDrop = !(this.organisationId &&
      this.universityId &&
      this.group &&
      this.lesson &&
      this.direction &&
      this.lessonGroups &&
      this.address &&
      this.timeStart &&
      this.timeEnd);
    if (!this.disableDragNDrop) {
      this.updateEventsDetails();
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

  showAddModal(): void {
    this.showAddEventModal = true;
  }

  addEventsClosed(event: any): void {
    this.showAddEventModal = false;
    if (event) {
      this.httpClient.post('/api/add_lesson_type', JSON.stringify(event)).toPromise()
        .then((res: IEvent) => {
          this.EVENT_LIST.push(res);
          this.updateEventsDetails();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getEventTypes(): void {
    this.httpClient.get('/api/get_lesson_types').toPromise()
      .then((res: IEvent[]) => {
        this.EVENT_LIST = res;
        this.updateEventsDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateEventsDetails(): void {
    const newEventsList = [];
    this.EVENT_LIST.forEach((el => {
      newEventsList.push(Object.assign({}, el));
    }));
    newEventsList.forEach((el) => {
      el.details = Object.assign({}, this.eventSettings);
    });
    this.EVENT_LIST = newEventsList;
  }
  inputDate(input: HTMLInputElement): void {
    if (input.name === 'start') {
      this.timeStart = input.value;
      const date = new Date();
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        +input.value.split(':')[0],
        +input.value.split(':')[1] + 90);
      const endDateInput: HTMLInputElement = document.querySelector('#endTime');
      endDateInput.value = `${endDate.getHours() < 9 ? `0${endDate.getHours()}` : endDate.getHours()}:${endDate.getMinutes() < 9 ?
          `0${endDate.getMinutes()}` : endDate.getMinutes()}`;
    } else {
      this.timeEnd = input.value;
    }
    this.updateEventSettings();
    this.checkDragNDropPermisson();
  }

}
