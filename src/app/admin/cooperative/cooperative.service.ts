import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Cooperative } from 'src/app/_models/cooperative.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminCooperativeService {
    private domain: string = 'cooperativa';

    constructor(private settingsService: SettingsService) { }

    add(cooperative: Cooperative) {
        const body = { name: cooperative.name };
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

    getByUserId(userId: string): Observable<any> {
        const url = `${this.domain}/obter-por-usuario/${userId}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    update(cooperative: Cooperative) {
        const body = {
            id: cooperative.id,
            acronym: cooperative.acronym,
            address: cooperative.address,
            bank: cooperative.bank,
            cnpj: cooperative.cnpj,
            cnpj_central: cooperative.cnpj_central,
            dap_caf_code: cooperative.dap_caf_code,
            email: cooperative.email,
            name: cooperative.name,
            phone: cooperative.phone,
            logo: cooperative.logo,
            legal_representative: cooperative.legal_representative,
            daps_fisicas_total: cooperative.daps_fisicas_total,
            indigenous_community_total: cooperative.indigenous_community_total,
            pnra_settlement_total: cooperative.pnra_settlement_total,
            quilombola_community_total: cooperative.quilombola_community_total,
            other_family_agro_total: cooperative.other_family_agro_total,
            pj_type: cooperative.pj_type,
            production_type: cooperative.production_type,
            dap_caf_registration_date: cooperative.dap_caf_registration_date,
            dap_caf_expiration_date: cooperative.dap_caf_expiration_date,

            is_dap: cooperative.is_dap,
            is_active: cooperative.is_active
        };

        return this.settingsService.executePut(this.domain, body);
    }
}
