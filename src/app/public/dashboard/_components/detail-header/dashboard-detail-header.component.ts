import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { PublicCall  } from 'src/app/_models/public-call.model';
import { convertJsonToCSV } from 'src/app/_utils/geral';

declare const convertToSlug: any;
declare const downloadFileCSV: any;

@Component({ selector: 'app-dashboard-detail-header', templateUrl: './dashboard-detail-header.component.html', styleUrls: ['./dashboard-detail-header.component.scss'] })
export class DashboardDetailHeaderComponent {
  @Input() backPage: string = '/';
  @Input() publicCall!: PublicCall;
  @Input() showTop: boolean = true;
  @Input() showDisclaimer: boolean = false;
  @Input() showHistory: boolean = false;
  @Input() validationReport!: any;
  @Output() onShowHistory: EventEmitter<boolean> = new EventEmitter();
  
  constructor(
    private publicCallService: AdminPublicCallService,
    private notificationService: NotificationService
  ) {
  }

  downloadValidationReport() {
    this.publicCallService.downloadValidationReport(this.validationReport.public_call_answer_id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const items = ret.retorno;

          const csv = convertJsonToCSV(items);
          const filename = `${convertToSlug(this.validationReport.cooperative_name)}.csv`;
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

  emitShowHistory() {
    this.onShowHistory.emit(true);
  }

  get status(): string {
    return (!this.publicCall || !this.publicCall.is_active || new Date(this.publicCall.registration_end_date) < new Date()) ? 'Cronograma Executado' : 'Em Andamento';
  }
}
