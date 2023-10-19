import { Component, Input } from '@angular/core';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';

@Component({ selector: 'app-public-call-status', templateUrl: './public-call-status.component.html', styleUrls: ['./public-call-status.component.scss'] })
export class PublicCallStatusComponent {
  @Input() status: number = PublicCallStatusEnum.emAndamento.id;
  public PublicCallStatusEnum: any = PublicCallStatusEnum;

  constructor() { }
}
