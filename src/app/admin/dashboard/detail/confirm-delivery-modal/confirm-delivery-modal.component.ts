import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faAdd, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

import { NotificationService } from 'src/app/_services/notification.service';

import { CooperativeDeliveryInfoProgress } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativePublicCallDelivery } from 'src/app/_models/cooperative-public-call-delivery.model';

declare const $: any;

@Component({ selector: 'app-confirm-delivery-modal', templateUrl: './confirm-delivery-modal.component.html', styleUrls: ['./confirm-delivery-modal.component.scss'] })
export class AdminDashboardDetailConfirmModalComponent {
    @Input() modal: any;
    @Input() publicCall: CooperativePublicCallDelivery | undefined;
    @Output() confirmDeliveryEvent: EventEmitter<any[]> = new EventEmitter();

    public deliveryDate: Date | undefined;
    public deliveryQuantity: number | undefined;
    public totalDeliveries: number = 0;

    public faIcons: any;

    constructor(
        private notificationService: NotificationService
    ) {
        this.faIcons = { faAdd, faCheckCircle, faTrash };
    }

    add() {
      let deliveryProgress = Object.assign([], this.publicCall!.delivery_progress);

      const lastDeliveryDate = deliveryProgress.length > 0 ? new Date(deliveryProgress[deliveryProgress.length - 1]['delivery_date']) : null;
      const totalQuantity = deliveryProgress.length > 0 ? deliveryProgress.reduce((acc: number, item: CooperativeDeliveryInfoProgress) => acc += item.delivery_quantity, 0) : 0;

      const addedDate = new Date(`${this.deliveryDate!} 05:00`);
      const addedQuantity = this.deliveryQuantity || 0;
      const errors: string[] = [];

      if (addedDate < new Date())
        errors.push('- A data inserida deve ser maior do que hoje');
      else if (lastDeliveryDate && addedDate <= lastDeliveryDate)
        errors.push('- A data inserida deve ser maior do que a última');

      if (addedQuantity <= 0)
        errors.push('- A quantidade deve ser maior do que zero');
      else if (totalQuantity && this.publicCall!.total_proposal! < (totalQuantity + addedQuantity))
        errors.push('- A soma das quantidades inseridas deve ser igual a quantidade total da proposta');

      if (errors.length > 0) {
        this.notificationService.showWarning(errors.join('\n\r'), 'Erro!');
        return;
      }

      const item = {
        delivery_date: this.deliveryDate!,
        delivery_quantity: this.deliveryQuantity!,
        id: '', delivery_percentage: 0, delivered_date: null, delivered_quantity: null, was_delivered: false, enable_to_confirm: true
      };

      deliveryProgress.push(item);
      this.publicCall!.delivery_progress = deliveryProgress;

      this.setTotalDelivery();

      this.deliveryDate = undefined;
      this.deliveryQuantity = undefined;

      $('.delivery-date').focus();
    }

    confirm() {
      const deliveries = this.publicCall!.delivery_progress!.map(dp => ({
        delivery_date: new Date(dp.delivery_date),
        delivery_quantity: dp.delivery_quantity
      }));

      const totalDeliveries = this.totalDeliveries;

      if (totalDeliveries !== this.publicCall!.total_proposal) {
        this.notificationService.showWarning('O total de entrega deve ser igual ao total proposto', 'Erro!');
        return;
      }

      this.confirmDeliveryEvent.emit(deliveries);
      this.modal.close('Confirm click');
    }

    removeDeliveryProgress(index: number) {
      this.publicCall?.delivery_progress?.splice(index, 1);
      this.setTotalDelivery();
      $('.delivery-date').focus();
    }

    setTotalDelivery() {
      const deliveryProgress: any[] = (this.publicCall && this.publicCall.delivery_progress) ? this.publicCall!.delivery_progress! : [{ delivery_quantity: 0 }];
      this.totalDeliveries = deliveryProgress.reduce((acc: number, item: any) => acc += item.delivery_quantity, 0);
    }
}
