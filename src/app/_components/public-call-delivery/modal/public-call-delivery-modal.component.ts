import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCheck, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

import { NotificationService } from 'src/app/_services/notification.service';
import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

import { CooperativeDeliveryInfo, CooperativeDeliveryInfoProgress } from 'src/app/_models/cooperative-delivery-info.model';
import { PublicCall } from 'src/app/_models/public-call.model';

declare const formatDate_ddMMyyyy: any;
declare const getDateWithoutTime: any;

@Component({ selector: 'app-public-call-delivery-modal', templateUrl: './public-call-delivery-modal.component.html', styleUrls: ['./public-call-delivery-modal.component.scss'] })
export class PublicCallDeliveryModalComponent {
    @Input() modal: any;
    @Input() publicCall: PublicCall | undefined;
    @Output() confirmDeliveryEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() removeDeliveryEvent: EventEmitter<boolean> = new EventEmitter();

    private _cooperative!: CooperativeDeliveryInfo;
    @Input() get cooperative(): CooperativeDeliveryInfo {
      return this._cooperative;
    }
    set cooperative(value: CooperativeDeliveryInfo) {
      this._cooperative = value;

      if (!value || !value.delivery_progress || value.delivery_progress.length <= 0)
        return;

      this.deliveredList = value.delivery_progress.filter(d => d.was_delivered);
      this.alreadyDelivered = this.deliveredList.reduce((acc, item) => acc += (item.delivered_quantity ?? 0), 0);
    }

    public faIcons: any;
    public alreadyDelivered: number | undefined = undefined;
    public nextDeliveryDate: Date | undefined = undefined;
    public nextDeliveryQuantity: number | undefined = undefined;
    public deliveredList: CooperativeDeliveryInfoProgress[] = [];

    constructor(
        private notificationService: NotificationService,
        private publicCallService: AdminPublicCallService
    ) {
        this.faIcons = { faCheck: faCheck, faCheckCircle: faCheckCircle, faTrash: faTrash };
    }

    confirmDelivery(delivery: CooperativeDeliveryInfoProgress) {
      if (delivery.was_delivered)
        return;

      const nextDeliveryDate = this.nextDeliveryDate ? new Date(this.nextDeliveryDate + 'T03:00') : new Date(delivery.delivery_date);
      const nextDeliveryQuantity = this.nextDeliveryQuantity || delivery.delivery_quantity;

      const totalDelivered = this.deliveredList.reduce((acc, item) => acc += item.delivered_quantity!, 0);

      if (nextDeliveryQuantity <= 0) {
        this.notificationService.showWarning(`A quantidade desta entrega deve ser maior do que 0 ${this.publicCall!.foods[0].measure_unit}`, 'Aviso!');
        return;
      }
      else if ((totalDelivered + nextDeliveryQuantity) > this.cooperative!.total_proposal) {
        const maxAllowed = `${this.cooperative!.total_proposal - totalDelivered} ${this.publicCall!.foods[0].measure_unit}`;
        this.notificationService.showWarning(`O máximo permitido para esta entrega é ${maxAllowed}`, 'Aviso!');
        return;
      }

      const lastDelivery = this.deliveredList.length > 0 ? this.deliveredList[this.deliveredList.length - 1] : undefined;

      if (lastDelivery) {
        const lastDeliveredDate = new Date(lastDelivery!.delivered_date!);

        if (getDateWithoutTime(nextDeliveryDate) < getDateWithoutTime(lastDeliveredDate)) {
          this.notificationService.showWarning(`A data desta entrega deve ser maior ou igual a ${formatDate_ddMMyyyy(lastDeliveredDate)}`, 'Aviso!');
          return;
        }
      }

      if (delivery.id) {
        this.publicCallService.confirmDeliveryPut(delivery.id, nextDeliveryDate, nextDeliveryQuantity).subscribe({
          next: (ret) => this.resultNext(ret, 'Não foi possível confirmar esta entrega', true),
          error: (error) => this.notificationService.showWarning('Não foi possível confirmar esta entrega', 'Tente novamente mais tarde')
        });
      } else {
        this.publicCallService.confirmDeliveryPost(this.cooperative!.public_call_answer_id!, nextDeliveryDate, nextDeliveryQuantity).subscribe({
          next: (ret) => this.resultNext(ret, 'Não foi possível confirmar esta entrega', true),
          error: (error) => this.notificationService.showWarning('Não foi possível confirmar esta entrega', 'Tente novamente mais tarde')
        });
      }
    }

    async removeDelivery(delivery: CooperativeDeliveryInfoProgress) {
      if (!(await this.notificationService.showConfirm('Você perderá todos os dados desta entrega', 'Deseja realmente excluir?')))
        return;

      this.publicCallService.removeDelivery(delivery.id).subscribe({
        next: (ret) => this.resultNext(ret, 'Não foi possível remover esta entrega', false),
        error: (error) => this.notificationService.showWarning('Não foi possível remover esta entrega', 'Tente novamente mais tarde')
      });
    }

    resultNext(ret: any, errorMessage: string, isConfirm: boolean) {
      if (ret && ret.sucesso) {
        const wasCompleted = ret.retorno.wasCompleted;
        this.nextDeliveryDate = undefined;
        this.nextDeliveryQuantity = undefined;

        if (isConfirm)
          this.confirmDeliveryEvent.emit(wasCompleted);
        else
          this.removeDeliveryEvent.emit(wasCompleted);

        return;
      }
  
      this.notificationService.showWarning(errorMessage, 'Erro');
    }

    get nextDelivery() : CooperativeDeliveryInfoProgress {
      const emptyDelivery = new CooperativeDeliveryInfoProgress();

      if (!this.cooperative || !this.cooperative.delivery_progress || this.cooperative.delivery_progress.length <= 0)
        return emptyDelivery;

      const awaitingToDeliveryList = this.cooperative.delivery_progress.filter(d => !d.was_delivered);

      return (!awaitingToDeliveryList || awaitingToDeliveryList.length <= 0) ? emptyDelivery : awaitingToDeliveryList[0];
    }
}
