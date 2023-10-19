import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';

@Injectable()
export class CooperativeGuard implements CanActivate {
    private localStorageUtils: LocalStorageUtils;

    constructor(private router: Router) {
        this.localStorageUtils = new LocalStorageUtils();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.localStorageUtils.getUser();
        const cooperative = this.localStorageUtils.getCooperative();
        const rota = state.url;

        if (user) {
            if (cooperative) {
                switch(cooperative.status) {
                    case 0:
                    case 1: // Aguardando Confirmar o E-mail
                        // if (rota.indexOf('/mensagem') >= 0)
                        //     return true;
                            
                        // // Redireciona para a tela de mensagem
                        // this.router.navigate(['/mensagem']);
                        // return false;
                    case 2: // Aguardando Completar o Registro
                        if (rota.indexOf('/cooperativa/complete-seu-registro/passo-') >= 0)
                            return true;
    
                        // Redireciona sempre para a tela de completar o registro
                        this.router.navigate([`/cooperativa/complete-seu-registro/passo-1/${cooperative.id}`]);
                        return false;
                    case 3: // Aguardando Autorização
                        break;
                    case 4: // Autorizada
                        break;
                }
    
                return true;
            }

            // Caso não seja cooperativa, redireciona para tela inicial admin
            this.router.navigate([`/admin/dashboard`]);
            return true;
        }

        // Caso contrário, redireciona para a tela de login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
