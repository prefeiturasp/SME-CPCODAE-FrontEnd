import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faPencil, faTimes } from '@fortawesome/free-solid-svg-icons';

import { GridViewConfig } from './_models/grid-view-config.model';

declare const sort_by: any;

@Component({ selector: 'app-grid-view', templateUrl: './grid-view.component.html', styleUrls: ['./grid-view.component.scss'] })
export class GridViewComponent {
  public currentPage: number = 1;
  public faIcons: any;

  @Output() onAdd = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<any>();

  private _config: GridViewConfig = new GridViewConfig();

  @Input() get config(): GridViewConfig {
    return this._config;
  }
  set config(value: GridViewConfig) {
    this._config = value;
  }

  constructor() {
    this.faIcons = { pencil: faPencil, times: faTimes };
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
  }

  getItemPropValue(item: any, itemProp: any): any {
    if (!itemProp.hasOwnProperty('type'))
      return item[itemProp.prop];

    const type = itemProp['type'];

    switch(type) {
      case 'boolean':
        return item[itemProp.prop] ? 'Sim' : 'Não';
      default:
        return item[itemProp.prop];
    }
  }

  goToAdd() {
    this.onAdd.emit();
  }

  goToEdit(id: string) {
    this.onEdit.emit(id);
  }

  remove(index: number, id: string) {
    this.onRemove.emit({ index, id });
  }

  get filteredList() : any[] {
 
    if (!this.sortedList)
      return [];

    if (!this.config.searchFilter || this.config.searchFilter.trim().length === 0)
      return this.sortedList;

    const filter = this.config.searchFilter.trim().toLowerCase();
    const filteredList = this.config.filterFn ? this.sortedList.filter(d => this.config.filterFn(d, filter)) : this.sortedList;

    return filteredList;
  }

  get sortedList() : any[] {
    if (!this.config.list)
      return [];

    return Object.assign([], this.config.list.sort(sort_by([{ name: 'name' }])));
  }

  get showPagination(): boolean {
    return this.config.list && this.config.list.length > this.config.pageSize!;
  }

  get visibleList() : any[] {

    if (!this.filteredList)
      return [];

    const allFilteredList = Object.assign([], this.filteredList);
    const startIndex = (this.currentPage - 1) * this.config.pageSize!;

    return allFilteredList.splice(startIndex, this.config.pageSize);
  }
}
