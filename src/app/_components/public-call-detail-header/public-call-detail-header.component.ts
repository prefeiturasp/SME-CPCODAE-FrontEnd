import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NotificationService } from 'src/app/_services/notification.service';

import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { PublicCall } from 'src/app/_models/public-call.model';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

@Component({ selector: 'app-public-call-detail-header', templateUrl: './public-call-detail-header.component.html', styleUrls: ['./public-call-detail-header.component.scss'] })
export class PublicCallDetailHeaderComponent {
  public PublicCallStatusEnum: any = PublicCallStatusEnum;
  @Input() publicCall: PublicCall | undefined;
  @Input() food_name?: string;
  @Input() chartValues: any[] = [];
  @Input() showButtons: boolean = false;
  @Input() showChart: boolean = false;
  @Output() onChangeStatusEvent = new EventEmitter<any>();
  @Output() onEditEvent = new EventEmitter<any>();
  @Output() onRemoveEvent = new EventEmitter<any>();
  @Output() onSuspendEvent = new EventEmitter<any>();

  public faIcons: any;

  public colorScheme = [{ name: "Entregue", value: '#FF9900' }];

  constructor(private notificationService: NotificationService) {
    this.faIcons = { back: faArrowLeft, pencil: faPencil };
  }

  public editPublicCall() {
    this.onEditEvent.emit(this.publicCall!.id);
  }

  public async removePublicCall() {
    if (!(await this.notificationService.showConfirm('Você perderá todos os dados desta chamada', 'Deseja realmente excluir?')))
      return;

    this.onRemoveEvent.emit(this.publicCall!.id);
  }

  public async suspendPublicCall() {
    if (!(await this.notificationService.showConfirm('Esta chamada não será mais exibida a nenhum usuário não administrativo', 'Deseja realmente suspender?')))
      return;
      
    this.onSuspendEvent.emit(this.publicCall!.id);
  }

  public async voltarHabilitacaoPublicCall() {
    if (!(await this.notificationService.showConfirm('Deseja realmente voltar esta chamada para a fase de habilitação?', '')))
      return;

    this.onChangeStatusEvent.emit({ public_call_id: this.publicCall!.id, status: PublicCallStatusEnum.emAndamento });
  }
}
