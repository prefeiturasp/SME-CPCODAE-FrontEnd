import { Component, Input } from '@angular/core';

import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({ selector: 'public-call-attachment-card-header', templateUrl: './attachment-card-header.component.html', styleUrls: ['./attachment-card-header.component.scss'] })
export class PublicCallAttachmentCardHeaderComponent {
  @Input() public document!: CooperativeDocument;
  @Input() public clickable: boolean = false;
  @Input() public isHistory: boolean = false;

  public faIcons: any;

  constructor() {
    this.faIcons = { info: faInfoCircle };
  }
}
