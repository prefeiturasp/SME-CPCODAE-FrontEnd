import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CooperativeService } from '../cooperative.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';

@Component({ selector: 'app-cooperative-email-confirmation', templateUrl: './email-confirmation.component.html', styleUrls: ['./email-confirmation.component.scss'] })
export class CooperativeEmailConfirmationComponent implements OnInit {
  public cooperativeId: string = '';
  public errorMessage: string = '';
  public invalid = false;
  public succeded = false;

  constructor(
    private cooperativeService: CooperativeService,
    private loginService: LoginService,
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginService.logout(false);
    const token = this.route.snapshot.paramMap.get('token') ?? '';

    this.menuService.showSearchFilter = false;

    this.cooperativeService.confirmEmailByToken(token).subscribe({
      next: (ret) => {
        this.succeded = ret && ret.sucesso;
        this.invalid = !ret || !ret.sucesso;

        if (this.invalid)
          this.errorMessage = 'Este token está inválido';

        if (this.succeded)
          this.cooperativeId = ret.retorno.id;
      },
      error: (error) => {
        console.log(error);
        this.invalid = true;
        this.errorMessage = error.mensagens[0];
      }
    });
  }
}
