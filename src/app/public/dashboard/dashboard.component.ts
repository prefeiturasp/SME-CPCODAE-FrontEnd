import { Component, OnInit } from '@angular/core';

import { DashboardService } from './dashboard.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { PublicCall } from 'src/app/_models/public-call.model';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

declare const isEmpty: any;

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class DashboardComponent implements OnInit {
  public active = 1;
  public publicCalls: PublicCall[] = [];
  public searchFilter: string = '';
  public PublicCallStatusEnum: any = PublicCallStatusEnum;

  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
    this.menuService.searchFilterChanged.subscribe(ret => this.searchFilter = ret);
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = true;

    this.dashboardService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const loggedUser = this.utilsService.localStorageUtils.getUser();

          ret.retorno.map((pc: PublicCall) => {
            const closed = (!pc.is_active || pc.status >= 2 || new Date(pc.registration_end_date) < new Date());

            pc.showParticipateButton = (isEmpty(loggedUser) || loggedUser!.roles.includes(this.loginService.cooperativeRoleName)) && !closed;
            pc.public_session_date_greater_than_today = new Date(pc.public_session_date) >= new Date();
            pc.status_name = this.getPublicCallStatusName(pc.status);
          });

          this.publicCalls = ret.retorno;
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar a lista de chamadas', 'Tente novamente mais tarde');
      }
    });
  }

  filterPublicCalls(lista: PublicCall[]): PublicCall[] {
    const term = this.searchFilter.toLowerCase();
    return lista.filter(c => c.name.toLowerCase().indexOf(term) >= 0 || c.number.toLowerCase().indexOf(term) >= 0);
  }

  getPublicCallStatusName(status: number) : string {
    switch(status) {
      case PublicCallStatusEnum.aberta.id: return PublicCallStatusEnum.aberta.text;
      case PublicCallStatusEnum.emAndamento.id: return PublicCallStatusEnum.emAndamento.text;
      case PublicCallStatusEnum.aprovada.id: return PublicCallStatusEnum.aprovada.text;
      case PublicCallStatusEnum.homologada.id: return PublicCallStatusEnum.homologada.text;
      case PublicCallStatusEnum.contratada.id: return PublicCallStatusEnum.contratada.text;
      case PublicCallStatusEnum.cronogramaExecutado.id: return PublicCallStatusEnum.cronogramaExecutado.text;
      case PublicCallStatusEnum.suspensa.id: return PublicCallStatusEnum.suspensa.text;
      case PublicCallStatusEnum.cancelada.id: return PublicCallStatusEnum.cancelada.text;
    }

    return '';
  }

  get publicCallsOnGoing(): PublicCall[] {
    if (!this.publicCalls)
      return [];

    let onGoing = this.publicCalls.filter(c => 
                          c.is_active
                          && c.status <= PublicCallStatusEnum.emAndamento.id
                          // && c.registration_end_date
                          // && new Date(c.registration_end_date.toString()) >= new Date()
                        );

    return (isEmpty(this.searchFilter)) ? onGoing : this.filterPublicCalls(onGoing);
  }

  get publicCallsClosed(): PublicCall[] {
    if (!this.publicCalls)
      return [];

    let closed = this.publicCalls.filter(c =>
                          !c.is_active
                          || c.status >= PublicCallStatusEnum.aprovada.id
                          // || !c.registration_end_date
                          // || new Date(c.registration_end_date.toString()) < new Date()
                        );

    return (isEmpty(this.searchFilter)) ? closed : this.filterPublicCalls(closed);
  }
}