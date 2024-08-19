import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { DashboardService } from '../dashboard.service';

import { PublicCall } from 'src/app/_models/public-call.model';

declare const isEmpty: any;

@Component({ selector: 'app-dashboard-detail', templateUrl: './dashboard-detail.component.html', styleUrls: ['./dashboard-detail.component.scss'] })
export class DashboardDetailComponent implements OnInit {
  public id: string = '';
  public publicCall!: PublicCall;

  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    this.id = this.route.snapshot.params['id'];

    this.dashboardService.get(this.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.publicCall = ret.retorno;
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar esta chamada', 'Tente novamente mais tarde');
      }
    });
  }
}
