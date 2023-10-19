import { Component } from '@angular/core';
// import { ContaService } from 'src/app/conta/_services/conta.service';

@Component({ selector: 'app-not-found', templateUrl: './not-found.component.html' })
export class NotFoundComponent
{
  public pagina_inicial: string = '';

  // constructor(private contaService: ContaService)
  // {
  //     this.pagina_inicial = this.contaService.obterPaginaInicial();
  // }
}

