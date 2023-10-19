import { Component, Input, OnInit } from '@angular/core';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Cooperative, CooperativeMember } from 'src/app/_models/cooperative.model';
import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';

@Component({ selector: 'app-cooperative-registration-completion-step3-list', templateUrl: './registration-completion-step3-list.component.html', styleUrls: ['./registration-completion-step3-list.component.scss'] })
export class CooperativeRegistrationCompletionStep3ListComponent implements OnInit {
  private _cooperative!: Cooperative;

  @Input() get cooperative(): Cooperative {
    return this._cooperative;
  }

  set cooperative(value: Cooperative) {
    this._cooperative = value;
    this.config.list = this._cooperative.members;
  }

  public config: GridViewConfig = new GridViewConfig();
  public submitted = false;

  constructor(
    private cooperativeService: CooperativeService,
    private notificationService: NotificationService) { 
      this.config = Object.assign(new GridViewConfig(), {
        props: [{ header: 'Cooperado', prop: 'name' }, { header: 'DAP/CAF', prop: 'dap_caf_code' }],
        list: [],
        showButtonArea: false,
        showButtonEdit: false,
        emptyMessage: 'Nenhum cooperado foi associado a esta cooperativa',
        pageSize: 10
      });
  }

  ngOnInit(): void {
  }
  
  removeMember($event: any) {
    const id: string = $event.id;
    const index = this.cooperative.members.findIndex(c => c.id === id);

    if (index >= 0) {
      this.cooperativeService.removeMember(id, this.cooperative.id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.cooperative.members.splice(index, 1);
            this.notificationService.showSuccess('Cooperado removido com sucesso', 'Sucesso!');
          } else {
            this.notificationService.showWarning('Não foi possível remover este cooperado', 'Erro!');
          }
        },
        error: (err) => { console.log(err); }
      });
    }
  }
}