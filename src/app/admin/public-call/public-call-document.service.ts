import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminPublicCallDocumentService {
    private domain: string = 'chamadas-publicas-documentos';

    constructor(private settingsService: SettingsService) { }

    get(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }
}
