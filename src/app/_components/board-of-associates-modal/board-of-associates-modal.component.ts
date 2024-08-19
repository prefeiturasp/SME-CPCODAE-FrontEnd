import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { NotificationService } from 'src/app/_services/notification.service';
import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { MemberInfo } from 'src/app/_models/public-call-answer.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { State } from 'src/app/_models/location.model';

import { BoardOfAssociatesComponent } from 'src/app/_components/board-of-associates/board-of-associates.component';

declare const focusOnFormError: any;

@Component({ selector: 'board-of-associates-modal', templateUrl: './board-of-associates-modal.component.html', styleUrls: ['./board-of-associates-modal.component.scss'] })
export class BoardOfAssociatesModalComponent implements OnInit {
  @ViewChild('boa') boaComponent!: BoardOfAssociatesComponent;

  @Input() modal: any;
  @Input() public_call_id: string = '';
  @Input() cooperative!: CooperativeDeliveryInfo;
  @Input() food: PublicCallFood | undefined;
  @Input() statesList!: State[];
  @Output() onSave: EventEmitter<boolean> = new EventEmitter();

  public submitted: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private publicCallService: AdminPublicCallService
  ) { }

  ngOnInit(): void {
    const memberInfo: MemberInfo = { 
      city_id: this.cooperative.city_id,
      city_members_total: this.cooperative.city_members_total,
      daps_fisicas_total: this.cooperative.daps_fisicas_total,
      indigenous_community_total: this.cooperative.indigenous_community_total,
      other_family_agro_total: this.cooperative.other_family_agro_total,
      pnra_settlement_total: this.cooperative.pnra_settlement_total,
      quilombola_community_total: this.cooperative.quilombola_community_total,
      only_woman: this.cooperative.only_woman,
      state_acronym: this.cooperative.state_acronym,
      total: 0
    };
    
    localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
  }

  onSubmit() {
    this.submitted = true;

    const proposalForm = this.boaComponent.proposalForm!;

    if (!this.boaComponent.validate()) {
      focusOnFormError(proposalForm.controls);
      return;
    }

    const city_id = this.boaComponent.proposalForm!.value.city_id;
    const daps_fisicas_total = this.boaComponent.proposalForm!.value.daps_fisicas_total;
    const indigenous_community_total = this.boaComponent.proposalForm!.value.indigenous_community_total;
    const other_family_agro_total = this.boaComponent.proposalForm!.value.other_family_agro_total;
    const pnra_settlement_total = this.boaComponent.proposalForm!.value.pnra_settlement_total;
    const quilombola_community_total = this.boaComponent.proposalForm!.value.quilombola_community_total;
    const only_woman = this.boaComponent.proposalForm!.value.only_woman;

    const memberInfo: MemberInfo = { city_id, daps_fisicas_total, indigenous_community_total, other_family_agro_total, pnra_settlement_total, quilombola_community_total, only_woman, city_members_total: 0, state_acronym: '', total: 0 };

    this.publicCallService.updateBoardOfAssociates(this.public_call_id, this.cooperative.cooperative_id, memberInfo)
    .subscribe({
      next: (ret) => this.resultNext(ret, 'Quadro de associados atualizado com sucesso', 'Não foi possível enviar esta solicitação'),
      error: (err) => console.log(err)
    });
  }

  onReset() {
    this.submitted = false;
    const proposalForm = this.boaComponent.proposalForm!;
    proposalForm.reset();
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.modal.close('Save click');
      this.onSave.emit(true);
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  get f() {
    const proposalForm = this.boaComponent.proposalForm!;
    return proposalForm.controls;
  }

  get getFoodName() {
    let value = this.food?.food_name ?? '';
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return value;
  }
}
