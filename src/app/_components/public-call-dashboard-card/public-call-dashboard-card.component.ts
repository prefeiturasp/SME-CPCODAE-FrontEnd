import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import { PublicCall } from 'src/app/_models/public-call.model';

@Component({ selector: 'app-public-call-dashboard-card', templateUrl: './public-call-dashboard-card.component.html', styleUrls: ['./public-call-dashboard-card.component.scss'] })
export class PublicCallDashboardCardComponent {
  public PublicCallStatusEnum: any = PublicCallStatusEnum;

  @Input() publicCall: PublicCall | undefined;
  @Input() filteredCalls: PublicCall[] | undefined;
  @Output() onClick = new EventEmitter<any>();

  public faIcons: any;

  constructor() {
    this.faIcons = { faArrowUp: faArrowUp };
  }

  clickOnCard(id: string) {
    this.onClick.emit({ id });
  }
}
