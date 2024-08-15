import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { State } from 'src/app/_models/location.model';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { BoardOfAssociatesComponent } from 'src/app/_components/board-of-associates/board-of-associates.component';

@Component({ selector: 'app-proposal-checkout', templateUrl: './proposal-checkout.component.html', styleUrls: ['./proposal-checkout.component.scss'] })
export class CooperativeProposalCheckoutComponent {
  @ViewChild('boa') boaComponent!: BoardOfAssociatesComponent;

  public selectedFoods: any[] | undefined = [];

  @Input() statesList: State[] = [];

  @Input() get filteredFoods(): any[] | undefined {
    return this.selectedFoods;
  }
  set filteredFoods(value: any[] | undefined) {
    this.selectedFoods = value;
  }

  public proposalForm: UntypedFormGroup | undefined;

  constructor(
    public publicCallService: AdminPublicCallService,
    public notificationService: NotificationService
  ) { }

  validate(): boolean {
    this.proposalForm = this.boaComponent.proposalForm;
    return this.boaComponent.validate();
  }
}
