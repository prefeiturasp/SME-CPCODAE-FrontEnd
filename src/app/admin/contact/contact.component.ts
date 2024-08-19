import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminContactService } from './contact.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { PublicCall } from 'src/app/_models/public-call.model';
import { SMEContact } from 'src/app/_models/contact.model';
import { AdminPublicCallService } from '../public-call/public-call.service';
import { AdminCooperativeService } from '../cooperative/cooperative.service';

import { Options } from 'select2';
import { Select2OptionData } from 'ng-select2';

declare const sort_by: any;

@Component({ selector: 'admin-contact', templateUrl: './contact.component.html', styleUrls: ['./contact.component.scss'] })
export class AdminContactComponent implements OnInit {
  public contacts: SMEContact[] = [];
  public cooperatives!: Array<Select2OptionData>;
  public publicCalls!: Array<Select2OptionData>;
  public options!: Options;
  public config: GridViewConfig = new GridViewConfig();

  public cooperative_id?: string = undefined;
  public public_call_id?: string = undefined;
  public start_date?: Date;
  public end_date?: Date;
  
  public faIcons: any;

  constructor(
    private cooperativeService: AdminCooperativeService,
    private contactService: AdminContactService,
    private publicCallService: AdminPublicCallService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
      this.menuService.showSearchFilter = false;
      this.faIcons = { filter: faFilter, times: faTimes };
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [
        { header: 'Chamada Pública', prop: 'public_call_name' },
        { header: 'Cooperativa', prop: 'cooperative_name' },
        { header: 'Assunto', prop: 'title' },
        { header: 'Data', prop: 'creation_date', type: 'date' }
      ],
      list: [],
      emptyMessage: 'Nenhuma mensagem Fale Conosco foi encontrada',
      showButtonArea: false,
      showButtonEdit: false,
      showButtonRemove: false,
      showButtonView: true
    });

    this.options = {
      multiple: false,
      closeOnSelect: true
    };

    this.loadCooperatives();
    this.loadPublicCalls();
  }

  clearDates() {
    this.start_date = undefined;
    this.end_date = undefined;
  }

  goToView(id: any) {
    this.router.navigate([`/admin/fale-conosco/${id}`]);
  }

  loadCooperatives() {
    this.cooperativeService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          let cooperatives = ret.retorno.map((c: Cooperative): Select2OptionData => ({ id: c.id, text: c.name }));
          this.cooperatives = cooperatives.sort(sort_by([{ name: 'text' }]));
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.log(err)
    });
  }

  loadPublicCalls() {
    this.publicCallService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          let publicCalls = ret.retorno.map((pc: PublicCall): Select2OptionData => ({ id: pc.id, text: `${pc.name} (${pc.number})` }));
          this.publicCalls = publicCalls.sort(sort_by([{ name: 'text' }]));
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.log(err)
    });
  }

  loadMessages() {
    const cooperative_id = this.cooperative_id;
    const public_call_id = this.public_call_id;

    let filteredStartDate: Date | null = null;
    let filteredEndDate: Date | null = null;
    
    if (this.start_date) {
      const filterStartDate = new Date(this.start_date);
      filteredStartDate = filterStartDate ?? new Date();
      filteredStartDate.setHours(0,0,0,0);
    }

    if (this.end_date) {
      const filterEndDate = new Date(this.end_date);
      filteredEndDate = (filterEndDate ?? new Date());
      filteredEndDate.setDate(filteredEndDate.getDate() + 1);
      filteredEndDate.setHours(0,0,0,0);
    }

    this.contactService.getAll({ start_date: filteredStartDate, end_date: filteredEndDate, cooperative_id, public_call_id }).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.contacts = ret.retorno;
      
          this.config.list = this.contacts;
          return;
        }
        
        this.notificationService.showWarning('Houve um erro ao tentar listar as mensagens', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }
}
