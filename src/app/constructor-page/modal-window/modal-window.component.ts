import {Component, OnInit, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

interface IModalWindowOptions {
  requestedUrl: string;
  inputPlaceholder: string;
  postParams?: object;
  getParams?: {};
  addSource?: string;
  addButton?: boolean;
  // tslint:disable-next-line:ban-types
  addButtonHandler?: Function;
  selectedItems?: any;
  multiSelect: boolean;
  target?: string;
  addModalParams?: any;
}

@Component({
  selector: 'app-modal-window',
  templateUrl: './templates/modal-window.component.html',
  styleUrls: ['./styles/modal-window.component.sass', './styles/modals-styles.component.sass']
})
export class ModalWindowComponent implements OnInit {

  @Input() options: IModalWindowOptions;
  @Input() addTemplate: TemplateRef<any>;
  @Input() listTemplate: TemplateRef<any>;
  @Input() selectedItems: any;
  @Output() closeWindow = new EventEmitter<any>();

  items: any;
  newSelectedItems = [];
  showAddModal = false;
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Close modal window without returning any items
   */
  closeModal(): void {
    this.closeWindow.emit();
  }

  /**
   * Submit selected items and close the modal window
   */
  submitSelection(): void {
    if (this.newSelectedItems.length > 0) {
      if (this.options.target) {
        this.closeWindow.emit({
          target: this.options.target,
          selectedItems: this.newSelectedItems[0]
        });
      } else {
        this.closeWindow.emit(this.newSelectedItems);
      }
    }
  }

  /**
   * Selection method for multi-selection
   * @param item - selected item
   */
  multiSelection(item: any): void {
    if (this.items[this.items.indexOf(item)].selected) {
      this.newSelectedItems.splice(this.newSelectedItems.indexOf(item), 1);
    } else {
      this.newSelectedItems.push(item);
    }
    this.items[this.items.indexOf(item)].selected = !this.items[this.items.indexOf(item)].selected;
  }

  /**
   * Selection method for single selection
   * @param item - selected item
   */
  selectOne(item: any): void {
    this.newSelectedItems = [];
    this.newSelectedItems.push(item);
    this.items.forEach((el: any) => {
      el.selected = false;
    });
    this.items[this.items.indexOf(item)].selected = !this.items[this.items.indexOf(item)].selected;
  }

  /**
   * Select item handler
   * @param item - selected item
   */
  selectItem(item: any): void {
    if (this.options.multiSelect) {
      this.multiSelection(item);
    } else {
      this.selectOne(item);
    }
  }

  openAddModal(input: HTMLInputElement): void {
    this.showAddModal = true;
  }

  hideAddModal(result: any): void {
    if (result) {
      let body = result;
      if (this.options.addModalParams) {
        body = Object.assign({}, result, this.options.addModalParams);
      }
      const items = this.items.concat();
      this.items = null;
      this.httpClient.post(this.options.addSource, JSON.stringify(body)).toPromise()
        .then((res) => {
          this.items = items;
          this.items.push(res);
          if (this.selectedItems) {
            this.items.forEach((el: any) => {
              this.selectedItems((selectedEl: any) => {
                if (el.id === selectedEl.id) {
                  el.selected = true;
                  this.newSelectedItems.push(el);
                }
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.showAddModal = false;
  }

  ngOnInit() {
    if (this.options.postParams) {
      this.httpClient.post(this.options.requestedUrl, JSON.stringify(this.options.postParams)).toPromise()
        .then((res) => {
          this.items = res;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (this.options.getParams) {
      const get = this.options.getParams;
      const params = new HttpParams({
        fromObject: get
      });
      this.httpClient.get(this.options.requestedUrl, {params}).toPromise()
        .then((res) => {
          this.items = res;
          if (this.selectedItems) {
            this.items.forEach((el: any) => {
              this.selectedItems((selectedEl: any) => {
                if (el.id === selectedEl.id) {
                  el.selected = true;
                  this.newSelectedItems.push(el);
                }
              });
            });
          } else {
            if (this.options.selectedItems) {
              this.items.forEach((el: any) => {
                this.options.selectedItems.forEach((selectedEl: any) => {
                  if (el.id === selectedEl.id) {
                    el.selected = true;
                    this.newSelectedItems.push(el);
                  }
                });
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
