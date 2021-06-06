import { Component, Output, EventEmitter } from '@angular/core';
import {ILesson, IDirection, IUniversity, ITutor} from './utils/interfaces';
import {HttpClient, HttpParams} from '@angular/common/http';

const REQUEST_URL = '';


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
  addSource?: string;
  addModalParams?: any;
}

interface IAddTutorResponse {
  lesson: string;
  tutors: Array<ITutor>;
}

@Component({
  selector: 'app-add-edit',
  templateUrl: './templates/add-edit.component.html',
  styleUrls: ['./styles/add-edit.component.sass']
})
/**
 * Modal window for editing and adding information about organisation
 * @author Zelensky Roman
 */
export class AddEditComponent {

  @Output() closePanel = new EventEmitter<void>();
  universities: IUniversity[];
  directions: IDirection[];
  lessons: ILesson[];
  showDirectionLoading = false;
  showLessonsLoading = false;
  showUniversitiesLoading = true;
  currentUniversityId: string;
  currentDirectionId: string;
  currentLessonId: string;
  showModalAddTeacher = false;

  teacherModalOptions: IModalWindowOptions;

  constructor(
    private httpClient: HttpClient
  ) {
    this.getInstitutes();
  }

  /**
   * University item click handler
   * @param item - university object
   */
  universitySelectedHandler(item: IUniversity): void {
    if (!this.showDirectionLoading && item.id !== this.currentUniversityId) {
      this.currentUniversityId = item.id;
      this.currentDirectionId = null;
      this.unSelectUniversities();
      item.selected = true;
      this.getDirections(item.id);
    }
  }

  /**
   * Direction item click handler
   * @param item - direction object
   */
  directionSelectedHandler(item: IDirection): void {
    if (!this.showLessonsLoading && item.id !== this.currentDirectionId) {
      this.currentDirectionId = item.id;
      this.clearDirectionsSelect();
      item.selected = true;
      this.lessons = null;
      this.getLessons(item.id);
    }
  }

  /**
   * Unselect selected universities handler
   */
  unSelectUniversities(): void {
    if (Array.isArray(this.universities)) {
      this.universities.forEach((el) => {
        el.selected = false;
      });
      this.clearDirectionsSelect();
      this.directions = null;
      this.lessons = null;
    }
  }

  /**
   * Unselect selected direction handler
   */
  unSelectDirections(): void {
    this.lessons = null;
    this.clearDirectionsSelect();
  }

  /**
   * Unselect selected directions
   */
  clearDirectionsSelect(): void {
    if (Array.isArray(this.directions)) {
      this.directions.forEach((el) => {
        el.selected = false;
      });
    }
  }

  /**
   * Unselect lessons handler
   */
  unSelectLessons(): void {
    return;
  }

  /**
   * Create new university
   * @param input - inputElement
   */
  createUniversity(input: HTMLInputElement): void {
    if (input.value.length > 5 && Array.isArray(this.universities)) {
      this.httpClient.post(
        `${REQUEST_URL}/api/add_institute`,
        JSON.stringify({ title: input.value })).toPromise()
        .then((res: IUniversity) => {
          this.universities.push(res);
          this.showUniversitiesLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      input.value = '';
    }
  }

  /**
   * Create new direction for university
   * @param input - direction input HTMLElement
   */
  createDirection(input: HTMLInputElement): void {
    if (input.value.length > 5 && this.currentUniversityId) {
      this.showDirectionLoading = true;
      const directionsCopy = this.directions.concat();
      this.directions = null;

      this.httpClient.post(
        `${REQUEST_URL}/api/add_direction`,
        JSON.stringify({title: input.value, institute: this.currentUniversityId})).toPromise()
        .then((res: IDirection) => {
          this.directions = directionsCopy;
          this.directions.push(res);
          this.showDirectionLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      input.value = '';
    }
  }

  /**
   * Create new element for direction
   * @param input - inputElement
   */
  createLesson(input: HTMLInputElement): void {
    if (input.value.length > 5 && this.currentDirectionId) {
      this.showLessonsLoading = true;
      const lessonsItemCopie = this.lessons.concat();
      this.lessons = null;

      this.httpClient.post(
        `${REQUEST_URL}/api/add_lesson`,
        JSON.stringify({title: input.value, direction: this.currentDirectionId})).toPromise()
        .then((res: ILesson) => {
          this.showLessonsLoading = false;
          this.lessons = lessonsItemCopie;
          this.lessons.push(res);
        })
        .catch((err) => {
          console.log(err);
        });
      input.value = '';
    }
  }

  /**
   * Get university's directions by university id
   * @param universityId - university id
   */
  getDirections(universityId: string): void {
    this.showDirectionLoading = true;
    const params = new HttpParams({
      fromObject: {
        institute: universityId
      }
    });
    this.httpClient.get(`${REQUEST_URL}/api/get_directions`, { params }).toPromise()
      .then((res: IDirection[]) => {
        this.directions = res;
        this.showDirectionLoading = false;
      })
      .catch((err) => {
        this.directions = undefined;
      });
  }

  /**
   * Get direction's lessons by direction id
   * @param directionId - direction id
   */
  getLessons(directionId: string): void {
    this.showLessonsLoading = true;
    const params = new HttpParams({
      fromObject: {
        direction: directionId
      }
    });
    this.httpClient.get(`${REQUEST_URL}/api/get_lessons`, { params }).toPromise()
      .then((res: ILesson[]) => {
        this.lessons = res;
        this.showLessonsLoading = false;
      })
      .catch((err) => {
        this.lessons = undefined;
      });
  }

  getInstitutes(): void {
    const params = new HttpParams({
      fromObject: {organisation: 'fb2cad60-13f4-4940-95dd-5a43081a0f31'}
    });
    this.httpClient.get(`${REQUEST_URL}/api/get_institutes`, {params}).toPromise()
      .then((res: IUniversity[]) => {
        this.showUniversitiesLoading = false;
        res.forEach((el: IUniversity) => {
          el.selected = false;
        });
        this.universities = res;
      });
  }

  /**
   * Close and update lessons list modal window handler
   * @param selectedItems - selected in modal window items
   */
  closeModalTeacher(selectedItems: any): void {
    if (selectedItems && selectedItems.length > 0) {
      const lessonsArray = this.lessons.concat();
      this.showLessonsLoading = true;
      this.lessons = null;
      this.httpClient.post(
        `${REQUEST_URL}/api/add_teacher_to_lesson`,
        JSON.stringify({lesson: this.currentLessonId, tutors: selectedItems})).toPromise()
        .then((res: IAddTutorResponse) => {
          this.showLessonsLoading = false;
          this.lessons = lessonsArray;
          this.lessons.forEach((el: ILesson) => {
            if (el.id === res.lesson) {
              el.tutors = res.tutors;
            }
          });
        })
        .catch((err) => {
          this.lessons = lessonsArray;
        });
    }
    this.showModalAddTeacher = false;
    this.currentLessonId = null;
  }

  /**
   * Open select modal window for adding tutors
   * @param lessonData - selected lesson object
   */
  openModalTeacher(lessonData: ILesson): void {
    this.currentLessonId = lessonData.id;
    this.teacherModalOptions = {
      requestedUrl: `${REQUEST_URL}/api/get_teachers_by_institute`,
      inputPlaceholder: 'Имя преподавателя...',
      getParams: {institute: this.currentUniversityId},
      addButton: true,
      selectedItems: lessonData.tutors,
      multiSelect: true,
      addSource: `${REQUEST_URL}/api/add_teacher`,
      addModalParams: {direction: this.currentDirectionId}
    };
    this.showModalAddTeacher = true;
  }

  addTutorHandler(input: HTMLInputElement): void {
    console.log(input);
  }

  lessonDeletedHandler(res: ILesson): void {
    this.lessons.splice(this.lessons.indexOf(res), 1);
  }

  directionDeletedHandler(res: IDirection): void {
    const deletedItem = this.directions.splice(this.directions.indexOf(res), 1);
    if (deletedItem[0].selected) {
      this.currentDirectionId = null;
      this.lessons = null;
    }
  }

  universityDeletedHandler(res: IDirection): void {
    const deletedItem = this.universities.splice(this.universities.indexOf(res), 1);
    if (deletedItem[0].selected) {
      this.currentUniversityId = null;
      this.directions = null;
      this.currentDirectionId = null;
      this.lessons = null;
    }
  }

  /**
   * Close button click handler
   */
  closeHandler(): void {
    this.unSelectUniversities();
    this.universities = undefined;
    this.lessons = undefined;
    this.directions = undefined;
    this.closePanel.emit();
  }

}
