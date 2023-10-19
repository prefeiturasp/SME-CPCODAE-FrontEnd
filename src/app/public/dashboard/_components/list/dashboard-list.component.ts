import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from 'src/app/_services/notification.service';

import { PublicCall  } from 'src/app/_models/public-call.model';

@Component({ selector: 'app-dashboard-list', templateUrl: './dashboard-list.component.html', styleUrls: ['./dashboard-list.component.scss'] })
export class DashboardListComponent implements OnInit {
  @Input() publicCalls: PublicCall[];
  
  constructor(
    private notificationService: NotificationService,
    private router: Router) {
    this.publicCalls = [];
  }

  ngOnInit(): void {
  }

  redirectToPublicSession(id: string) {
    const chamada = this.publicCalls.find(c => c.id === id);

    if (!chamada || !chamada.public_session_url) {
        this.notificationService.showWarning('Houve um erro ao tentar acessar a sessão', 'Erro');
        return;
    }

    window.open(chamada.public_session_url, '_blank');
  }

  signUp(publicCall: PublicCall) {
    const today = new Date();

    if (new Date(publicCall.registration_start_date) <= today && new Date(publicCall.registration_end_date) >= today) {
      this.router.navigate([`/chamadas-publicas/${publicCall.id}/inscricao`]);
      return;
    }
    
    this.notificationService.showWarning('Esta chamada não está aberta para inscrições', 'Aguarde!');
  }
}
