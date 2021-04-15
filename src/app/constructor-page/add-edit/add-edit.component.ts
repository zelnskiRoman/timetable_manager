import { Component, Output, EventEmitter } from '@angular/core';
import {ILesson, IDirection, IUniversity} from './utils/interfaces';

// TODO: Remove when API is ready
import {
  getUniversityDirections,
  directivesLessons,
  getUniversitiesTemp } from './utils/directives-data';


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

  constructor() {
    this.universities = getUniversitiesTemp('lllll-lllll-lllll');
  }

  /**
   * University item click handler
   * @param item - university object
   */
  universitySelectedHandler(item: any): void {
    this.unSelectUniversities();
    item.selected = true;
    this.directions = this.getDirections(item.id);
    return;
  }

  /**
   * Direction item click handler
   * @param item - direction object
   */
  directionSelectedHandler(item: IDirection): void {
    this.clearDirectionsSelect();
    item.selected = true;
    this.lessons = this.getLessons(item.id);
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
    return
  }

  /**
   * Create new university
   * @param input - inputElement
   */
  createUniversity(input: HTMLInputElement): void {
    if (input.value.length > 5 && Array.isArray(this.universities)) {
      this.universities.push({
        id: 'uuuuu-uuuuu-uuuuu',
        title: input.value,
        selected: false
      });
      input.value = '';
    }
  }

  /**
   * Create new direction for university
   * @param input - direction input HTMLElement
   */
  createDirection(input: HTMLInputElement): void {
    if (input.value.length > 5 && Array.isArray(this.directions)) {
      this.directions.push({
        id: 'zzzzz-zzzzz-zzzzz',
        title: input.value,
        groups: [],
        selected: false
      });
      input.value = '';
    }
  }

  /**
   * Create new element for direction
   * @param input - inputElement
   */
  createLesson(input: HTMLInputElement): void {
    if (input.value.length > 5 && Array.isArray(this.lessons)) {
      this.lessons.push({
        id: 'vvvvv-vvvvv-vvvvv',
        title: input.value,
        tutors: [],
        selected: false
      });
      input.value = '';
    }
  }

  /**
   * Get universities by organisation (account) id
   * @param universityId - university id
   */
  getUniversities(universityId: string): IDirection[] {
    // TODO: Add HTTP request
    return getUniversityDirections(universityId);
  }

  /**
   * Get university's directions by university id
   * @param universityId - university id
   */
  getDirections(universityId: string): IDirection[] {
    // TODO: Add HTTP request
    return getUniversityDirections(universityId);
  }

  /**
   * Get direction's lessons by direction id
   * @param directionId - direction id
   */
  getLessons(directionId: string): ILesson[] {
    // TODO: Add HTTP request
    return directivesLessons[directionId];
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
