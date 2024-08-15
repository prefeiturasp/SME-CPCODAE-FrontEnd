import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/_services/notification.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { CooperativeDashboardService } from './dashboard.service';

import { CooperativePublicCallDelivery } from 'src/app/_models/cooperative-public-call-delivery.model';
import { CooperativeService } from '../cooperative.service';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

declare const groupByKey: any;
declare const sort_by: any;

@Component({ selector: 'app-cooperative-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class CooperativeDashboardComponent implements OnInit {
    public active = 1;
    public publicCalls: CooperativePublicCallDelivery[] = [];
    public publicCallsClosed: CooperativePublicCallDelivery[] = [];
    public publicCallsOnGoing: CooperativePublicCallDelivery[] = [];
    public publicCallsWaiting: CooperativePublicCallDelivery[] = [];
    public hasMessages: boolean = false;

    constructor(
        private cooperativeService: CooperativeService,
        private dashboardService: CooperativeDashboardService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private modalService: NgbModal
      ) {
        this.menuService.showSearchFilter = true;
        this.menuService.searchFilterChanged.subscribe(ret => this.buildPublicCallsList(ret));
    }

    ngOnInit(): void {
        this.loadPage();
    }

    buildPublicCallsList(searchFilter: string) {
        const emAndamento: number[] = [PublicCallStatusEnum.homologada.id];
        const cronogramaExecutado: number[] = [PublicCallStatusEnum.cronogramaExecutado.id];
        const notChosen: number[] = [PublicCallStatusEnum.aprovada.id, PublicCallStatusEnum.homologada.id, PublicCallStatusEnum.contratada.id, PublicCallStatusEnum.cronogramaExecutado.id, PublicCallStatusEnum.suspensa.id, PublicCallStatusEnum.cancelada.id, PublicCallStatusEnum.deserta.id];
        const aguardando: number[] = [PublicCallStatusEnum.emAndamento.id, PublicCallStatusEnum.aprovada.id];

        this.publicCallsOnGoing = this.filterPublicCalls(searchFilter, this.publicCalls.filter(pc => pc.was_chosen && emAndamento.includes(pc.status)));
        this.publicCallsClosed = this.filterPublicCalls(searchFilter, this.publicCalls.filter(pc => cronogramaExecutado.includes(pc.status) || (notChosen.includes(pc.status) && !pc.was_chosen)));

        let waitingList = this.filterPublicCalls(searchFilter, this.publicCalls.filter(pc => aguardando.includes(pc.status)));

        waitingList.map(pc =>
            {
                const info = this.getPublicSessionDateInfo(pc);

                pc.public_session_date_color_class = info.color_class;
                pc.public_session_date_percentage = info.percentage;
            });
        this.publicCallsWaiting = waitingList;
        this.publicCallsWaiting.map(pc => {
            if (pc.messages != null && pc.messages.length > 0) {
                pc.has_messages = !pc.messages[0].is_response;
                pc.last_message_is_invisible = pc.messages[0].not_visible;
            }
        });
        this.hasMessages = this.publicCallsWaiting.some(pc => pc.has_messages);
    }

    filterPublicCalls(searchFilter: string, publicCalls: CooperativePublicCallDelivery[]) : CooperativePublicCallDelivery[] {
        if (!publicCalls)
            return [];

        searchFilter = searchFilter?.trim().toLowerCase() ?? '';

        let filtered = publicCalls.filter(pc =>
            (pc.name.toLowerCase().indexOf(searchFilter) >= 0 || pc.process.toLowerCase().indexOf(searchFilter) >= 0)
        );

        return filtered.sort(sort_by([{ name: 'public_session_date', reverse: true }]));
    }

    confirmDelivery(success: boolean) {
        if (success)
            this.loadPage();
    }

    getPublicSessionDateInfo(publicCall: CooperativePublicCallDelivery): any {
        const public_session_date = new Date(publicCall.public_session_date);
        const creation_date = new Date(publicCall.creation_date);
        const totalDays = public_session_date.getTime() - creation_date.getTime();
        const totalDaysRemaining = public_session_date.getTime() - new Date().getTime();
        const percentage = totalDaysRemaining * 100.0 / totalDays;

        let color_class = 'green';

        if (percentage > 10 && percentage <= 45)
            color_class = 'yellow';
        else if (percentage > 45 && percentage <= 80)
            color_class = 'orange';
        else if (percentage > 80)
            color_class = 'red';

        return { color_class, percentage };
    }

    loadPage() {
        this.dashboardService.getAll().subscribe({
            next: (ret)  => {
                if (ret && ret.sucesso) {
                    const publicCalls = ret.retorno.sort(sort_by([{ 'name': 'status' }, { 'name': 'public_session_date' }]));
                    this.loadMessages(publicCalls);
                }
            },
            error: (error) => {
               console.log(error);
               this.notificationService.showWarning('Não foi possível listar as chamadas públicas', 'Tente novamente mais tarde');
            }
        });
    }

    loadMessages(publicCalls: CooperativePublicCallDelivery[]) {
        this.cooperativeService.getMessages().subscribe({
          next: (ret) => {
            if (ret && ret.sucesso) {
                const messages = groupByKey(ret.retorno, 'public_call_id');

                publicCalls.map(pc => {
                    pc.messages = [];

                    if (messages[pc.id] && messages[pc.id][0].food_id === pc.food_id)
                        pc.messages = messages[pc.id];
                });

                //publicCalls = publicCalls.filter(x => x.messages!.length > 0);
                this.publicCalls = publicCalls;
                this.buildPublicCallsList('');
            }
          },
          error: (err) => console.log(err)
        })
    }

    openModal(content: any) {
        this.modalService.open(content, { centered: true });
    }

    onRemoveProposal(success: boolean) {
        if (success)
            this.loadPage();
    }
}
