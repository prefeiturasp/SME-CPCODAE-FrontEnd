import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import { PublicCall } from 'src/app/_models/public-call.model';

import { AdminPublicCallService } from '../public-call/public-call.service';

@Component({ selector: 'admin-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class AdminDashboardComponent implements OnInit {
  public PublicCallStatusEnum: any = PublicCallStatusEnum;
  public publicCalls: PublicCall[] = [];
  public availableStatus: number[] = [
    PublicCallStatusEnum.emAndamento.id,
    PublicCallStatusEnum.aprovada.id,
    PublicCallStatusEnum.homologada.id,
    PublicCallStatusEnum.contratada.id,
    PublicCallStatusEnum.cronogramaExecutado.id,
    PublicCallStatusEnum.suspensa.id,
    PublicCallStatusEnum.cancelada.id
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

  goToAdd($event: any) {
    this.router.navigate([`/admin/chamadas-publicas/nova`]);
  }

  goToDetail($event: any) {
    const publicCall = this.publicCalls.find(p => p.id === $event.id);

    this.router.navigate([`/admin/chamadas-publicas/${$event.id}/propostas`], { state: { publicCall } });
  }
}
