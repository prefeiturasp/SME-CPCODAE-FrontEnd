import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from 'src/app/authorization/login/login.service';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';

@Injectable()
export class AdminGuard implements CanActivate {
    private localStorageUtils: LocalStorageUtils;

    constructor(private loginService: LoginService, private router: Router) {
        this.localStorageUtils = new LocalStorageUtils();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.localStorageUtils.getUser();

        if (user && user.roles.includes(this.loginService.adminRoleName)) {
            return true;
        }

        // Caso contrário, redireciona para a tela de login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
