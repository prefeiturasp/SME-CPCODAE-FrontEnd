import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';
import { User } from 'src/app/_models/user.model';

import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from './menu.service';

declare const isEmpty: any;

@Component({ selector: 'app-menu', templateUrl: './menu.component.html', styleUrls: ['./menu.component.scss'] })
export class MenuComponent {
  public isCollapsed: boolean;
  public loggedUser: User | null;
  public canAccessTopMenu: boolean = false;
  public currentRole: string = '';
  public isLogged: boolean;
  public router: Router;
  public showSearchFilter: boolean = false;

  private _searchFilter: string = '';

  //usuario_is_admin: boolean;
  localStorageUtils = new LocalStorageUtils();

  constructor(private loginService: LoginService, private menuService: MenuService, private routerService: Router) {
    this.isCollapsed = true;
    this.router = routerService;

    this.loggedUser = this.localStorageUtils.getUser();
    this.isLogged = !isEmpty(this.loggedUser);
    this.currentRole = this.isLogged && (this.loggedUser?.roles?.length ?? 0) > 0 ? (this.loggedUser?.roles[0] ?? '') : '';

    if (this.currentRole === 'cooperativa') {
      const cooperative = this.localStorageUtils.getCooperative();
      this.canAccessTopMenu = cooperative != null && cooperative!.status > 3;
    }
    
    this.menuService.showSearchFilterChanged.subscribe(ret => this.showSearchFilter = ret);
    this.loginService.userLoginChanged.subscribe((ret: User) => this.updateUserData(ret));
  }

  logout() {
    this.loginService.logout();
  }

  updateUserData(user: User) {
    this.loggedUser = user;
    this.isLogged = user != null;
  }

  get profileRouterLink(): string {
    return `/${ this.currentRole }/${this.loggedUser?.id}`;
  }

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(term: string) {
    this._searchFilter = term;
    this.menuService.searchFilter = term;
  }
}
