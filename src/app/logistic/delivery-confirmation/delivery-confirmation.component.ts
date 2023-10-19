import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

import { PublicCall } from 'src/app/_models/public-call.model';

@Component({ selector: 'logistic-delivery-confirmation', templateUrl: './delivery-confirmation.component.html', styleUrls: ['./delivery-confirmation.component.scss'] })
export class LogisticDeliveryConfirmationComponent {
  public id: string = '';
  public publicCall: PublicCall | undefined;

  constructor(
    public publicCallService: AdminPublicCallService,
    private router: Router
  ) {
    const currentState: any = this.router.getCurrentNavigation()?.extras?.state;

    if (currentState) {
      this.publicCall = currentState.publicCall;
    }
  }

  goBack($event: boolean) {
    this.router.navigate(['/logistica/chamadas-publicas']);
  }
}
