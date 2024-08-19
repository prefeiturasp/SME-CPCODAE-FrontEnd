import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SMECategory } from 'src/app/_models/category.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminCategoryService {
    private domain: string = 'categoria-alimento';

    constructor(private settingsService: SettingsService) { }

    add(category: SMECategory) {
        const body = { name: category.name };
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

    update(category: SMECategory) {
        const body = {
            id: category.id,
            name: category.name,
            is_active: category.is_active
        };
        return this.settingsService.executePut(this.domain, body);
    }
}
