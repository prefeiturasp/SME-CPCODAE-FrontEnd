import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/authorization/login/login.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { User } from 'src/app/_models/user.model';

import { filter } from 'rxjs/operators';

declare const $: any;
declare const isEmpty: any;

@Component({ selector: 'app-menu-sidebar-logistic', templateUrl: './menu-sidebar-logistic.component.html', styleUrls: ['./menu-sidebar-logistic.component.scss'] })
export class MenuSidebarLogisticComponent {
  public faIcons: any;
  public isOpened: boolean = false;
  public show: boolean = false;

  public activeUrl: string = '';

  constructor(
    private loginService: LoginService,
    private utilsService: UtilsService,
    private router: Router) {
      const user = this.utilsService.localStorageUtils.getUser();
      this.show = !isEmpty(user) && !isEmpty(user!.roles) && user!.roles.includes(this.loginService.logisticRoleName);

      this.loginService.userLoginChanged.subscribe((ret: User) => this.updateMenuVisibility(ret));
      this.faIcons = { arrowLeft: faArrowLeft, arrowRight: faArrowRight, home: faHome };

      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(
        (res: any) => this.activeUrl = res.url);
  }

  goTo(url: string) {
    if (this.isOpened)
      this.toggleMenu();

    this.router.navigate([url]);
  }

  toggleMenu() {
    if (this.isOpened) { // Fechando
      $('.sidebar').removeClass('active');
      $('.overlay').removeClass('active');

      $('ul.menu-elements li a span').hide("slide", { direction: "left" }, 200);
    } else { // Abrindo
      $('.sidebar').addClass('active');
      $('.overlay').addClass('active');
      // close opened sub-menus
      $('.collapse.show').toggleClass('show');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');

      setTimeout(() => $('ul.menu-elements li a span').show("slide", { direction: "left" }), 150);
    }

    this.isOpened = !this.isOpened;
  }

  updateMenuVisibility(user: User | null) {
    this.show = !isEmpty(user) && user!.roles.includes(this.loginService.logisticRoleName);
  }
}
