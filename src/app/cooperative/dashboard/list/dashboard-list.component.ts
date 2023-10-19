import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from 'src/app/_services/notification.service';
import { CooperativeDashboardService } from '../dashboard.service';

import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import { CooperativePublicCallDelivery } from 'src/app/_models/cooperative-public-call-delivery.model';
import { convertJsonToCSV, getDateWithoutTime } from 'src/app/_utils/geral';

declare const convertToSlug: any;
declare const downloadFileCSV: any;

@Component({ selector: 'app-cooperative-dashboard-list', templateUrl: './dashboard-list.component.html', styleUrls: ['./dashboard-list.component.scss'] })
export class CooperativeDashboardListComponent {
    public PublicCallStatusEnum: any = PublicCallStatusEnum;

    private _publicCalls: CooperativePublicCallDelivery[] = [];
    @Input() public get publicCalls(): CooperativePublicCallDelivery[] {
        return this._publicCalls;
    }
    set publicCalls(value: CooperativePublicCallDelivery[]) {
        if (value != null) {
            const today = getDateWithoutTime(new Date());
            value.forEach((v: CooperativePublicCallDelivery) => {
                let registration_end_date = new Date(v.registration_end_date);
                registration_end_date.setHours(registration_end_date.getHours() + 3);
                
                v.registrationDateIsGreaterThanToday = getDateWithoutTime(registration_end_date) > today
            });
        }
        
        this._publicCalls = value;
    }

    @Input() public pageIndex: number = 1;
    @Output() public onAccept: EventEmitter<any> = new EventEmitter();
    @Output() public onOpenModal: EventEmitter<any> = new EventEmitter();
    @Output() public onRemoveProposal: EventEmitter<any> = new EventEmitter();

    constructor(
        private dashboardService: CooperativeDashboardService,
        private notificationService: NotificationService,
        private router: Router,
    ) { }

    async confirmDelivery(publicCall: CooperativePublicCallDelivery) {
        // if (!(await this.notificationService.showConfirm('Deseja aceitar a entrega desta proposta?', '')))
        //     return;

        this.dashboardService.confirmDelivery(publicCall.public_call_answer_id!).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.notificationService.showSuccess('Proposta aceita com sucesso', 'Sucesso');
                    this.onAccept.emit(true);
                }
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível listar as chamadas públicas', 'Tente novamente mais tarde');
                this.onAccept.emit(false);
            }
        });
    }

    downloadMembersList(public_call_answer_id?: string) {
        this.dashboardService.getMembersList(public_call_answer_id!).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    const items = ret.retorno;
  
                    const csv = convertJsonToCSV(items);
                    const filename = `membros_${convertToSlug(public_call_answer_id)}.csv`;
                    downloadFileCSV(csv, filename);

                    this.notificationService.showSuccess('Lista baixada com sucesso', 'Sucesso');
                }
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível encontrar a lista de membros desta proposta', 'Tente novamente mais tarde');
            }
        });
    }

    goToProposal(public_call_id: string, food_id: string) {
        const url = `/chamadas-publicas/${public_call_id}/edicao-proposta/${food_id}`;
        this.router.navigate([url]);
    }

    openModal(content: any) {
        this.onOpenModal.emit(content);
    }

    async removeProposal(public_call_answer_id: string) {
        if (!(await this.notificationService.showConfirm('Caso continue, a proposta será removida e não poderá ser recuperada', 'Deseja remover esta proposta?')))
            return;

        this.dashboardService.removeProposal(public_call_answer_id).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.notificationService.showSuccess('Proposta removida com sucesso', 'Sucesso');
                    this.onRemoveProposal.emit(true);
                }
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível remover a proposta', 'Tente novamente mais tarde');
                this.onRemoveProposal.emit(false);
            }
        });
    }

    async resendMemberList (public_call_id: string, food_id: string, public_call_answer_id?: string) {
        if (!(await this.notificationService.showConfirm('Caso continue, a planilha anterior será apagada', 'Deseja reenviar a planilha?')))
            return;

        this.dashboardService.clearMemberList(public_call_answer_id!).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.goToProposal(public_call_id, food_id);
                    return;
                }

                this.notificationService.showWarning('Não foi possível apagar a planilha atual', 'Tente novamente mais tarde');
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível apagar a planilha atual', 'Tente novamente mais tarde');
            }
        });
    }
}
