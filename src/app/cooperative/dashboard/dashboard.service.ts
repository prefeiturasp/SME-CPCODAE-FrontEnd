import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from 'src/app/_services/settings.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Injectable({ providedIn: 'root', })
export class CooperativeDashboardService {
    private domain: string = 'chamadas-publicas';

    constructor(private settingsService: SettingsService, private utilsService: UtilsService) { }

    clearMemberList(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/dashboard-cooperative/${public_call_answer_id}/members-list/clear`;
        return this.settingsService.executePatch(url, {});
    }

    confirmDelivery(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/confirm-delivery/${public_call_answer_id}`;
        return this.settingsService.executePost(url, {});
    }

    getAll(): Observable<any> {
        const loggedCooperative = this.utilsService.localStorageUtils.getCooperative();
        const cooperative_id: string = loggedCooperative!.id;

        const url = `${this.domain}/dashboard-cooperative/${cooperative_id}`;
        return this.settingsService.executeGet(url);
    }

    getAllDeliveryProgress(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/dashboard-cooperative/${public_call_answer_id}/delivery-info`;
        return this.settingsService.executeGet(url);
    }

    getMembersList(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/dashboard-cooperative/${public_call_answer_id}/members-list`;
        return this.settingsService.executeGet(url);
    }

    getProposalDeclaration(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/dashboard-cooperative/${public_call_answer_id}/report`;
        return this.settingsService.executeGetBlob(url);
    }

    removeProposal(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/dashboard-cooperative/${public_call_answer_id}/remove-proposal`;
        return this.settingsService.executeDelete(url);
    }
}
