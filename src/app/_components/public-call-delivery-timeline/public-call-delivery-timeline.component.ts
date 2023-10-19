import { Component, Input } from '@angular/core';

import { CooperativeDeliveryInfo, CooperativeDeliveryInfoProgress } from 'src/app/_models/cooperative-delivery-info.model';

@Component({ selector: 'app-public-call-delivery-timeline', templateUrl: './public-call-delivery-timeline.component.html', styleUrls: ['./public-call-delivery-timeline.component.scss'] })
export class PublicCallDeliveryTimelineComponent {
    private _deliveryInfo!: CooperativeDeliveryInfo;

    @Input() public measure_unit: string = '';
    @Input() public get deliveryInfo(): CooperativeDeliveryInfo {
        const totalProposed = this._deliveryInfo.delivery_progress.filter(d => d.id != '').reduce((acc, item) => acc += item.delivery_quantity, 0);
        const totalDelivered = this._deliveryInfo.delivery_progress.reduce((acc, item) => acc += (item.delivered_quantity ?? 0), 0);
        const totalAwaiting = this._deliveryInfo.delivery_progress.filter(d => !d.was_delivered).reduce((acc, item) => acc += item.delivery_quantity, 0);

        const awaitingToDelivery = totalProposed - (totalDelivered + totalAwaiting);

        if (awaitingToDelivery > 0) {
            const delivery_date = this._deliveryInfo.delivery_progress.reduce((acc, item) => { return new Date(item.delivery_date) > new Date(item.delivery_date) ? acc : item; }).delivery_date;
            const delivery_quantity = awaitingToDelivery;

            this._deliveryInfo.delivery_progress.push({ id: '', delivery_date: delivery_date, delivery_quantity: delivery_quantity, delivered_date: null, delivered_quantity: null, delivery_percentage: 99.99, was_delivered: false, enable_to_confirm: true });
        }

        return this._deliveryInfo;
    }

    set deliveryInfo(value: CooperativeDeliveryInfo) {
        this._deliveryInfo = value;
    }

    constructor() { }
}
