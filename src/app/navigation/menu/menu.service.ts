import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', })
export class MenuService {
  public searchFilterChanged: EventEmitter<string> = new EventEmitter();
  public showSearchFilterChanged: EventEmitter<boolean> = new EventEmitter();

  public _searchFilter: string = '';
  public _showSearchFilter: boolean = false;

  constructor() { }

  get showSearchFilter(): boolean {
    return this._showSearchFilter;
  }

  set showSearchFilter(val: boolean) {
    this._showSearchFilter = val;
    this.showSearchFilterChanged.emit(val);
  }

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(val: string) {
    this._searchFilter = val;
    this.searchFilterChanged.emit(val);
  }
}
