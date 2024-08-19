import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    private localStorageUtils: LocalStorageUtils;

    constructor(private router: Router) {
        this.localStorageUtils = new LocalStorageUtils();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Caso tenha dados de usuário
        if (this.localStorageUtils.getUser()) {
            return true;
        }

        // Caso contrário, redireciona para a tela de login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
