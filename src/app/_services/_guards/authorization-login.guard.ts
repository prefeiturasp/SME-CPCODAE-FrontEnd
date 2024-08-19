import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from 'src/app/authorization/login/login.service';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';

declare const isEmpty: any;

@Injectable()
export class AuthorizationLoginGuard implements CanActivate {
    private localStorageUtils: LocalStorageUtils;

    constructor(private loginService: LoginService, private router: Router) {
        this.localStorageUtils = new LocalStorageUtils();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Caso NÃO tenha dados de usuário
        if (isEmpty(this.localStorageUtils.getUser())) {
            return true;
        }
        else if (state.url.indexOf('recuperar-senha') >= 0) { // Caso esteja logado, porém seja recuperação de senha, desloga
            this.loginService.logout();
            return true;
        }

        // Caso contrário, redireciona para a tela home
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
