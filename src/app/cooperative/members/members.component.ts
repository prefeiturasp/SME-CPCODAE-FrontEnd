import { Component, OnInit } from '@angular/core';

import { AdminCooperativeService } from 'src/app/admin/cooperative/cooperative.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { Cooperative } from 'src/app/_models/cooperative.model';

declare const isEmpty: any;

@Component({ selector: 'app-cooperative-members', templateUrl: './members.component.html', styleUrls: ['./members.component.scss'] })
export class CooperativeMembersComponent implements OnInit {
    public active: number = 1;
    public cooperative: Cooperative | null = null;

    constructor(
        private cooperativeService: AdminCooperativeService,
        private loginService: LoginService,
        private utilsService: UtilsService
    ) { }

    ngOnInit(): void {
        const cooperative = this.utilsService.localStorageUtils.getCooperative();

        if (isEmpty(cooperative)) {
            this.loginService.logout(true);
            return;
        }

        this.cooperativeService.get(cooperative!.id).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.cooperative = ret.retorno;
                }
            },
            error: (err) => console.log(err)
        });
    }
}