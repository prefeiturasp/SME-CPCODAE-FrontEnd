import { Component, Input } from '@angular/core';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { PublicCall } from 'src/app/_models/public-call.model';

@Component({ selector: 'app-dashboard-checkout', templateUrl: './dashboard-checkout.component.html', styleUrls: ['./dashboard-checkout.component.scss'] })
export class AdminDashboardDetailCheckoutComponent {
  @Input() publicCall!: PublicCall;
  @Input() cooperatives: CooperativeDeliveryInfo[] = [];

  constructor(
      public publicCallService: AdminPublicCallService,
  ) {
  }

  getSelectedCooperativesByFood(food_id: string): CooperativeDeliveryInfo[] {
    return this.cooperatives.filter(c => c.food_id === food_id && c.is_selected);
  }
    
  getSelectedQuantity(food_id: string): number {
    const selectedCooperatives = this.getSelectedCooperativesByFood(food_id);
    if (!selectedCooperatives || selectedCooperatives.length <= 0)
      return 0;

    return selectedCooperatives.reduce((acc, item) => acc += (item.total_proposal_edited || item.total_proposal), 0);
  }

  get selectedCooperatives(): CooperativeDeliveryInfo[] {
    if (!this.cooperatives)
      return [];

    return this.cooperatives.filter(c => c.is_selected);
  }
}
