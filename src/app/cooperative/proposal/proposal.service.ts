import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardService } from 'src/app/public/dashboard/dashboard.service';
import { SettingsService } from 'src/app/_services/settings.service';

import { PublicCallCategoryAnswer } from 'src/app/_models/public-call-answer.model';

@Injectable()
export class ProposalService {
  private domain: string = 'chamadas-publicas';
  public clickGeneralInfoPanelEvent: EventEmitter<any>;

  constructor(
    private dashboardService: DashboardService,
    private settingsService: SettingsService,
  ) {
    this.clickGeneralInfoPanelEvent = this.dashboardService.clickGeneralInfoPanelEvent;
  }

  get(id: string): Observable<any> {
    const url = `${this.domain}/${id}`;
    return this.settingsService.executeGet(url);
  }

  getData(public_call_id: string, cooperative_id: string, food_id: string): Observable<any> {
    const url = `${this.domain}/${public_call_id}/${cooperative_id}/${food_id}`;
    return this.settingsService.executeGet(url);
  }

  sendProposal(publicCallAnswer: PublicCallCategoryAnswer, is_edit_proposal: boolean,
      requires_new_upload: boolean, changeRequest?: any): Observable<any> {
    const body = {
      public_call_id: publicCallAnswer.public_call_id,
      cooperative_id: publicCallAnswer.cooperative_id,
      foods: publicCallAnswer.foods,
      members: !is_edit_proposal || requires_new_upload ? publicCallAnswer.members : [],

      change_request_title: changeRequest?.title,
      change_request_message: changeRequest?.message
    };

    const endpoint = is_edit_proposal ? 'update-answer' : 'add-answer';
    const url = `${this.domain}/${publicCallAnswer.public_call_id}/${endpoint}/${publicCallAnswer.cooperative_id}`;
    return is_edit_proposal ? this.settingsService.executePut(url, body) : this.settingsService.executePost(url, body);
  }

  validateMembersList(data: any): Observable<any> {
    const url = `cooperado/validate-members-list`;
    return this.settingsService.executePost(url, data);
  }
}
