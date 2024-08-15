import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from 'src/app/_services/settings.service';

import { toQueryString } from 'src/app/_utils/geral';

@Injectable({ providedIn: 'root', })
export class AdminContactService {
    private domain: string = 'fale-conosco';

    constructor(private settingsService: SettingsService) { }

    get(id: string) : Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(params: any) : Observable<any> {
        const queryString = toQueryString(params);
        
        const url = `${this.domain}?${queryString}`;
        return this.settingsService.executeGet(url);
    }
}
