import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { DashboardService } from '../../dashboard.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { PublicCall  } from 'src/app/_models/public-call.model';

declare const $: any;

@Component({ selector: 'app-dashboard-general-info', templateUrl: './dashboard-general-info.component.html', styleUrls: ['./dashboard-general-info.component.scss'] })
export class DashboardGeneralInfoComponent implements OnInit, AfterViewInit {
  @Input() backPage: string = '/';
  @Input() publicCall!: PublicCall;
  @Input() disableAccordion: boolean = false;
  @Input() isOpened: boolean = false;
  @Input() showParticipateButton: boolean = false;
  
  @ViewChild('acc') accComponent!: NgbAccordion;
  
  constructor(private dashboardService: DashboardService, private notificationService: NotificationService) {
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.isOpened)
      this.accComponent.activeIds = "publicacao-abertura";

    if (this.disableAccordion) {
      $('.accordion-button').addClass('hidden-acc').prop('disabled', true);
    }
  }

  beforeChange($event: NgbPanelChangeEvent) {
    this.dashboardService.clickGeneralInfoPanelEvent.emit($event);
  }

  downloadEdital() {
    if (!this.publicCall || !this.publicCall.notice_url) {
      this.notificationService.showWarning('Houve um erro ao tentar acessar o arquivo do edital', 'Erro');
      return;
    }

    window.open(this.publicCall.notice_url, '_blank');
  }

  redirectToPublicSession() {
    if (!this.publicCall || !this.publicCall.public_session_url) {
      this.notificationService.showWarning('Houve um erro ao tentar acessar a sessão', 'Erro');
      return;
    }

    window.open(this.publicCall.public_session_url, '_blank');
  }
}
