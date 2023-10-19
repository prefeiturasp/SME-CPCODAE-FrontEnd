import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { PublicCall } from 'src/app/_models/public-call.model';

import { MenuService } from 'src/app/navigation/menu/menu.service';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

declare const $: any;
declare const sort_by: any;

@Component({ selector: 'app-public-call-dashboard', templateUrl: './public-call-dashboard.component.html', styleUrls: ['./public-call-dashboard.component.scss'] })
export class PublicCallDashboardComponent implements OnInit {
  @Input() publicCalls: PublicCall[] = [];
  @Input() availableStatus: number[] = [ 
    PublicCallStatusEnum.aberta.id,
    PublicCallStatusEnum.emAndamento.id,
    PublicCallStatusEnum.aprovada.id,
    PublicCallStatusEnum.homologada.id
   ];
  @Input() showNewPublicCall = false;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onClick = new EventEmitter<any>();

  public faIcons: any;
  public filterStartDate: Date;
  public filterEndDate: Date;
  public filterStatus: number = -1;
  public searchFilter: string = '';
  public PublicCallStatusEnum: any = PublicCallStatusEnum;

  constructor(
    private menuService: MenuService
  ) {
    this.menuService.showSearchFilter = true;
    this.menuService.searchFilterChanged.subscribe(ret => this.searchFilter = ret);
    $('.search-filter').val('');

    this.faIcons = { filter: faFilter };

    const today = new Date();
    let startDate = new Date();
    startDate.setMonth(today.getMonth() - 3);
    let endDate = new Date();
    endDate.setMonth(today.getMonth() + 3);

    this.filterStartDate = startDate;
    this.filterEndDate = endDate;
  }

  ngOnInit(): void {
  }

  get filteredCalls(): PublicCall[] {
    if (!this.publicCalls)
      return [];

    const filteredStatus = this.filterStatus === -1 ? this.availableStatus : [this.filterStatus];

    const filterStartDate = new Date(this.filterStartDate);
    let filteredStartDate = filterStartDate ?? new Date();
    filteredStartDate.setHours(0,0,0,0);

    const filterEndDate = new Date(this.filterEndDate);
    let filteredEndDate = (filterEndDate ?? new Date());
    filteredEndDate.setDate(filteredEndDate.getDate() + 1);
    filteredEndDate.setHours(0,0,0,0);

    const searchFilter = this.searchFilter?.trim().toLowerCase() ?? '';

    let filtered = this.publicCalls.filter(pc =>
      filteredStatus.includes(pc.status)
      && (filteredStartDate <= new Date(pc.public_session_date) && filteredEndDate >= new Date(pc.public_session_date))
      && (pc.name.toLowerCase().indexOf(searchFilter) >= 0 || pc.process.toLowerCase().indexOf(searchFilter) >= 0 || pc.number.toLowerCase().indexOf(searchFilter) >= 0)
    );

    return filtered.sort(sort_by([{ name: 'status' }, { name: 'public_session_date', reverse: true }]));
  }

  clickOnCard($event: any) {
    this.onClick.emit($event);
  }

  goToAdd() {
    this.onAdd.emit();
  }
}
