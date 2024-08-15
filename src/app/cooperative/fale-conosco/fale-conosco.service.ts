import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';
import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class CooperativeFaleConoscoService {
    private domain: string = 'fale-conosco';
    private localStorageUtils = new LocalStorageUtils();

    constructor(private settingsService: SettingsService) { }

    getPublicCalls() : Observable<any> {
        const loggedCooperative = this.localStorageUtils.getCooperative();

        if (!loggedCooperative)
            return EMPTY;

        const cooperative_id: string = loggedCooperative.id;
        const url = `${this.domain}/public-calls/${cooperative_id}`;
        return this.settingsService.executeGet(url);
    }

    send(public_call_id: string, title: string, message: string): Observable<any> {
        const loggedUser = this.localStorageUtils.getUser();
        const loggedCooperative = this.localStorageUtils.getCooperative();

        if (!loggedUser || !loggedCooperative)
            return EMPTY;

        const user_id: string = loggedUser.id;
        const cooperative_id: string = loggedCooperative.id;
        const body = { user_id, cooperative_id, public_call_id, title, message };
        const url = `${this.domain}/send-message`;
        return this.settingsService.executePost(url, body);
    }
}
