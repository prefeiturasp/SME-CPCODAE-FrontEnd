import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

import { PublicCall } from 'src/app/_models/public-call.model';

@Component({ selector: 'logistic-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class LogisticDashboardComponent implements OnInit {
  public PublicCallStatusEnum: any = PublicCallStatusEnum;
  public publicCalls: PublicCall[] = [];
  public availableStatus: number[] = [
    PublicCallStatusEnum.contratada.id,
    PublicCallStatusEnum.cronogramaExecutado.id
  ];

  constructor(public publicCallService: AdminPublicCallService, private router: Router) { }

  ngOnInit(): void {
    this.publicCallService.getAllDashboard().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso && ret.retorno.length > 0) {
          this.publicCalls = ret.retorno;
        }
      },
      error: (err) => console.log(err)
    })
  }

  goToDeliveryConfirmation($event: any) {
    const publicCall = this.publicCalls.find(p => p.id === $event.id);

    this.router.navigate([`/logistica/chamadas-publicas/${$event.id}/confirmar-entrega`], { state: { publicCall } });
  }
}
