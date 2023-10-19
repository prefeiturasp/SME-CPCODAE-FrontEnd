import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faAdd, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

import { CooperativeDashboardService } from '../dashboard.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { CooperativePublicCallDelivery } from 'src/app/_models/cooperative-public-call-delivery.model';
import { CooperativeDeliveryInfoProgress } from 'src/app/_models/cooperative-delivery-info.model';

declare const $: any;

@Component({ selector: 'app-accept-modal', templateUrl: './accept-modal.component.html', styleUrls: ['./accept-modal.component.scss'] })
export class CooperativeDashboardAcceptModalComponent {
    @Input() modal: any;
    @Output() confirmDeliveryEvent: EventEmitter<CooperativePublicCallDelivery> = new EventEmitter();
    
    private _publicCall!: CooperativePublicCallDelivery;
    @Input() get publicCall(): CooperativePublicCallDelivery {
        return this._publicCall;
    }

    set publicCall(value: CooperativePublicCallDelivery) {
        this._publicCall = value;

        this.loadInfo();
    }

    public deliveryDate: Date | undefined;
    public deliveryQuantity: number | undefined;
    public totalDeliveries: number = 0;
    public deliveryProgress: CooperativeDeliveryInfoProgress[] = [];

    public faIcons: any;

    constructor(
        private dashboardService: CooperativeDashboardService,
        private notificationService: NotificationService
    ) {
        this.faIcons = { faAdd, faCheckCircle, faTrash };
    }

    confirm() {
        this.modal.close('Confirm click');
        this.confirmDeliveryEvent.emit(this.publicCall!);
    }

    loadInfo() {
        this.dashboardService.getAllDeliveryProgress(this.publicCall.public_call_answer_id!).subscribe({
            next: (ret)  => {
                if (ret && ret.sucesso) {
                    this.deliveryProgress = ret.retorno;
                    this.publicCall.delivery_progress = this.deliveryProgress;
                }
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível listar os dados de entrega desta chamada pública', 'Tente novamente mais tarde');
            }
        });
    }
}