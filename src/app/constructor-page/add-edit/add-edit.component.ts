import { Component, Output, EventEmitter } from '@angular/core';
import { ILesson, IUnivDirection } from './utils/interfaces';

import { getUniversityDirections, directivesLessons, university} from './utils/directives-data';

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
  universities;
  univDirections: IUnivDirection[];
  directionLessons: ILesson[];

  constructor() {
    this.universities = university;
  }

/**
 * University click handler
 * @param item - university object
 */
  universitySelectedHandler(item: any): void {
    this.unSelectUniversities();
    item.selected = true;
    this.univDirections = getUniversityDirections(item.id);
    return;
  }

/**
 * Unselect selected universities
 */
  unSelectUniversities(): void {
    if (Array.isArray(this.universities)) {
      this.universities.forEach((el) => {
        el.selected = false;
      });
      this.unSelectDirections();
      this.univDirections = null;
      this.directionLessons = null;
    }
  }

/**
 * Get universities directions by university id
 * @param universityId - university id
 */
  getUniversityDirections(universityId: string): void {

  }

/**
 * Clear selection for all universities directions
 */
  unSelectDirections(): void {
    if (Array.isArray(this.univDirections)) {
      this.univDirections.forEach((el) => {
        el.selected = false;
      });
    }
  }

/**
 * On direction click handler
 * @param item - direction object
 */
  clickDirectionHandler(item: IUnivDirection): void {
    this.unSelectDirections();
    item.selected = true;
    this.directionLessons = this.getDirectionLessons(item.id);
  }

/**
 * Unselect direction handler / Directions input click handler
 */
  directionUnselectedHandler(): void {
    this.directionLessons = null;
    this.unSelectDirections();
  }

/**
 * Add new direction
 * @param input - direction input HTMLElement
 */
  addUnivDirection(input: HTMLInputElement): void {
    if (input.value.length > 5) {
      this.univDirections.push({
        id: 'zzzzz-zzzzz-zzzzz',
        title: input.value,
        groups: [],
        selected: false
      });
    }
    input.value = '';
  }

/**
 * Get direction's lessons by direction id
 * @param directionId - direction id
 */
  getDirectionLessons(directionId: string): ILesson[] {
    return directivesLessons[directionId];
  }

/**
 * Close button click handler
 */
  closeHandler(): void {
    this.unSelectUniversities();
    this.universities = undefined;
    this.directionLessons = undefined;
    this.univDirections = undefined;
    this.closePanel.emit();
  }

}
