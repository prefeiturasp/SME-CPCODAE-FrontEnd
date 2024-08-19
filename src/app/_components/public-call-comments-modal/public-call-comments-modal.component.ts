import { Component, Input } from '@angular/core';

import { ChangeRequest } from 'src/app/_models/change-request.model';
import { CooperativeSimplified } from 'src/app/_models/cooperative.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';

@Component({ selector: 'public-call-comments-modal', templateUrl: './public-call-comments-modal.component.html', styleUrls: ['./public-call-comments-modal.component.scss'] })
export class PublicCallCommentsModalComponent {
    @Input() modal: any;
    @Input() public_call_id: string = '';
    @Input() cooperative!: CooperativeSimplified;
    @Input() food: PublicCallFood | undefined;

    private _changeRequests: ChangeRequest[] = [];

    @Input() 
    get changeRequests(): ChangeRequest[] {
      if (!this._changeRequests)
        return [];
        
      return this._changeRequests.filter(cr => cr.cooperative_id === this.cooperative.id && cr.food_id === this.food!.food_id && !cr.not_visible);
    };
    set changeRequests(value: ChangeRequest[]) {
      this._changeRequests = value;
    }

    constructor() { }
  }
