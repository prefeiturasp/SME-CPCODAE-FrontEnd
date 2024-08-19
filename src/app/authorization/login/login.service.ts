import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { User } from 'src/app/_models/user.model';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Injectable()
export class LoginService {
  public userLoginChanged: EventEmitter<User | null> = new EventEmitter();
  public adminRoleName: string = 'admin';
  public cooperativeRoleName: string = 'cooperativa';
  public logisticRoleName: string = 'logistica';

  constructor(
    private cooperativeService: CooperativeService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.settingsService.executePost('login', { email, password });
  }

  loginExecute(email: string, password: string, component: any) {
    this.login(email, password).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const user: User = ret.retorno;

          if (user && user.token) {
            let returnUrl = component.returnUrl || '/';
            this.utilsService.localStorageUtils.saveUser(user);

            if (user.roles.includes(this.cooperativeRoleName)) {
              this.cooperativeService.getByUserIdLogin(user.id).subscribe({
                next: (retC: any) => {
                  const cooperative: Cooperative = retC.retorno;

                  if (cooperative) {
                    if (returnUrl === '/') {
                      returnUrl = '/cooperativa';
                    }

                    this.utilsService.localStorageUtils.saveCooperative(cooperative);
                    this.loginExecuteSucceded(user, returnUrl);
                  }
                },
                error: (errorC: any) => {
                  console.log(errorC);
                }
              })
            } else if (user.roles.includes(this.adminRoleName)) {
              if (returnUrl === '/') {
                returnUrl = '/admin';
              }

              this.loginExecuteSucceded(user, returnUrl);
            } else {
              if (returnUrl === '/') {
                returnUrl = '/logistica';
              }

              this.loginExecuteSucceded(user, returnUrl);
            }
          }

          this.notificationService.showSuccess(`Seja bem vindo, ${user.firstName}`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Usuário e/ou senha inválidos', 'Erro');
        
        component.submitted = false;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loginExecuteSucceded(user: User, returnUrl: string) {
    this.userLoginChanged.emit(user);
    this.router.navigate([returnUrl]);
  }

  logout(redirect: boolean = true) {
    this.utilsService.localStorageUtils.clearLoggedData();
    this.cooperativeService.cooperativeChanged.emit(null);
    this.userLoginChanged.emit(null);

    if (redirect)
      this.router.navigate(['/']);
  }

  sendEmailRecoverPassword(email: string) {
    return this.settingsService.executePost('recuperar-senha', { email });
  }
}
