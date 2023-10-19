import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from 'src/app/_models/user.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminUserService {
    private domain: string = 'usuario';

    constructor(private settingsService: SettingsService) { }

    add(user: User) {
        const body = { name: user.name, email: user.email, role: user.role };
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

    update(doc: User) {
        const body = {
            id: doc.id,
            name: doc.name,
            email: doc.email,
            is_active: doc.is_active
        };
        return this.settingsService.executePut(this.domain, body);
    }
}
