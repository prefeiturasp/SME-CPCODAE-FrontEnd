import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { faArrowLeft, faArrowRight, faBuilding, faFileLines, faHome, faUsers } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/authorization/login/login.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { User } from 'src/app/_models/user.model';

import { filter } from 'rxjs/operators';
import { CooperativeService } from 'src/app/cooperative/cooperative.service';

declare const $: any;
declare const groupByKey: any;
declare const isEmpty: any;

@Component({ selector: 'app-menu-sidebar-cooperative', templateUrl: './menu-sidebar-cooperative.component.html', styleUrls: ['./menu-sidebar-cooperative.component.scss'] })
export class MenuSidebarCooperativeComponent implements OnInit {
  public faIcons: any;
  public isOpened: boolean = false;
  public hasMessages: boolean = false;

  public activeUrl: string = '';

  public cooperative: Cooperative | null = null;
  public user: User | null = null;

  constructor(
    private cooperativeService: CooperativeService,
    private loginService: LoginService,
    private utilsService: UtilsService,
    private router: Router) {
      this.faIcons = { arrowLeft: faArrowLeft, arrowRight: faArrowRight, building: faBuilding, fileLines: faFileLines, home: faHome, users: faUsers };

    this.user = this.utilsService.localStorageUtils.getUser();
    this.cooperative = this.utilsService.localStorageUtils.getCooperative();

    this.loginService.userLoginChanged.subscribe((ret: User) => this.user = ret);
    this.cooperativeService.cooperativeChanged.subscribe((ret: Cooperative) => this.cooperative = ret);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(
      (res: any) => this.activeUrl = res.url);
  }

  ngOnInit(): void {
    if (this.show)
      this.loadMessages();
  }

  goTo(url: string) {
    if (this.isOpened)
      this.toggleMenu();

    this.router.navigate([url]);
  }

  loadMessages() {
    this.cooperativeService.getMessages().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const messages = groupByKey(ret.retorno, 'public_call_id');
          this.hasMessages = Object.entries(messages).some((item: any) => item[1][0].is_response === false);
        }
      },
      error: (err) => console.log(err)
    })
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

  get show(): boolean {
    return !isEmpty(this.user) 
      && this.user!.roles.includes(this.loginService.cooperativeRoleName)
      && !isEmpty(this.cooperative)
      && this.cooperative?.status === 3;
  }
}
