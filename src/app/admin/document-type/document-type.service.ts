import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SMEDocumentType } from 'src/app/_models/document-type.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminDocumentTypeService {
    private domain: string = 'tipo-documento';

    constructor(private settingsService: SettingsService) { }

    add(doc: SMEDocumentType) {
        const body = { name: doc.name, application: doc.application };
        return this.settingsService.executePost(this.domain, body);
    }

    delete(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeDelete(url);
    }

    get(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    update(doc: SMEDocumentType) {
        const body = {
            id: doc.id,
            name: doc.name,
            application: doc.application,
            is_active: doc.is_active
        };
        return this.settingsService.executePut(this.domain, body);
    }
}
