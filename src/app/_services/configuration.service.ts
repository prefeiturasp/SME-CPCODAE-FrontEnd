import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from './settings.service';
import { SMEConfiguration } from '../_models/configuration.model';

@Injectable()
export class ConfigurationService {
    private domain: string = 'configuracoes';

    constructor(
        private settingsService: SettingsService,
    ) { }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    getMaximumYearSuppliedValue(): Observable<any> {
        const url = `${this.domain}/maximum-year-supplied-value`;
        return this.settingsService.executeGet(url);
    }

    update(configuration: SMEConfiguration) {
        const body = {
            id: configuration.id,
            name: configuration.name,
            value: configuration.value.toString(),
            is_active: configuration.is_active
        };
        return this.settingsService.executePut(this.domain, body);
    }
}