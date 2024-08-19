import { Component, OnInit } from '@angular/core';

import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';

@Component({ selector: 'app-message-page', templateUrl: './message-page.component.html', styleUrls: ['./message-page.component.scss'] })
export class MessagePageComponent implements OnInit {
  private localStorageUtils: LocalStorageUtils;
  private loginMessage: string = 'Realize o login para continuar';
  public message: string = '';

  constructor(
    private loginService: LoginService,
    private menuService: MenuService
  ) {
    this.localStorageUtils = new LocalStorageUtils();
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;

    const user = this.localStorageUtils.getUser();
    const cooperative = this.localStorageUtils.getCooperative();

    if (!user) {
      this.message = this.loginMessage;
      return;
    }

    // Se for cooperativa
    if (user.roles.includes(this.loginService.cooperativeRoleName)) {
      if (!cooperative) {
        this.loginService.logout();
        this.message = this.loginMessage;
        return;
      }

      switch (cooperative.status) {
        case 1: // Aguardando Confirmar o E-mail
          this.message = 'Acesse seu e-mail para confirmar seu endereço e continuar seu cadastro';
          break;
        case 2: // Aguardando Completar o Registro
          this.message = `${this.loginMessage} seu cadastro`;
          break;
        case 3: // Aguardando Autorização
        case 4: // Autorizada
        default:
          this.message = this.loginMessage;
          break;
      }

      return;
    }
    
    this.message = this.loginMessage;
  }
}
