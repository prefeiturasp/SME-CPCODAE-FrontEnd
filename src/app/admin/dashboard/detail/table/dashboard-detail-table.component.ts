import { Component, Input } from '@angular/core';
import { faCopy, faMapMarkerAlt, faPercentage, faSeedling, faUsers } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { ChangeRequest } from 'src/app/_models/change-request.model';
import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { PublicCall } from 'src/app/_models/public-call.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { convertJsonToCSV, copyToClipboard } from 'src/app/_utils/geral';

declare const $: any;
declare const convertToSlug: any;
declare const downloadFileCSV: any;

@Component({ selector: 'app-dashboard-detail-table', templateUrl: './dashboard-detail-table.component.html', styleUrls: ['./dashboard-detail-table.component.scss'] })
export class AdminDashboardDetailTableComponent {
    @Input() publicCall!: PublicCall;
    @Input() changeRequests: ChangeRequest[] = [];
    @Input() cooperatives: CooperativeDeliveryInfo[] = [];
    @Input() documents: CooperativeDocument[] = [];
    @Input() food!: PublicCallFood;

    public faIcons: any;

    constructor(
        private notificationService: NotificationService,
        public publicCallService: AdminPublicCallService,
        private modalService: NgbModal,
    ) {
        this.faIcons = { copy: faCopy, goodLocationAlt: faMapMarkerAlt, inclusiveCooperative: faUsers, organic: faSeedling, percentage: faPercentage };
    }

    copyToClipboardCnpj(text: string) {
      if (!text)
          return;

        text = text.trim();
        copyToClipboard(text);

        this.notificationService.showSuccess('Cnpj copiado', 'Sucesso!');
    }

    downloadValidationReport(cooperative_id: string) {
      const cooperative = this.cooperatives.find(c => c.cooperative_id === cooperative_id);
  
      if (!cooperative) {
        this.notificationService.showWarning('Cooperativa não encontrada', 'Erro!');
        return;
      }
  
      this.publicCallService.downloadValidationReport(cooperative.public_call_answer_id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            const items = ret.retorno;
  
            const csv = convertJsonToCSV(items);
            const filename = `${convertToSlug(cooperative.name)}.csv`;
            downloadFileCSV(csv, filename);
            this.notificationService.showSuccess('Download do relatório realizado com sucesso', 'Sucesso!');
            return;
          }
  
          this.notificationService.showWarning('Não foi possível realizar o download do relatório', 'Erro');
        },
        error: (err) => {
          this.notificationService.showError('Não foi possível realizar o download do relatório', 'Erro');
          console.log(err);
        }
      });
    }

    loadChangeRequestHistory(publicCallId: string) {
      this.publicCallService.getAllChangeRequestHistory(publicCallId).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.changeRequests = ret.retorno;
          }
        },
        error: (error) => {
          console.log(error);
          this.notificationService.showWarning('Não foi possível carregar o histórico de mensagens', 'Tente novamente mais tarde');
        }
      });
    }

    openModal(content: any, isChangeRequest: boolean) {
      const size = isChangeRequest ? 'lg' : 'md';
  
      this.modalService.open(content, { centered: true, size });
    }

    selectCooperative(cooperative: CooperativeDeliveryInfo) {
      cooperative.is_selected = !cooperative.is_selected;
    }

    validateMembers(cooperative_id: string) {
      $(".upload:hidden").attr('data-id', cooperative_id);
      $(".upload:hidden").trigger('click');
    }
}
