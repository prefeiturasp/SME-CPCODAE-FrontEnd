import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CooperativeMember } from 'src/app/_models/cooperative.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminCooperativeMemberService {
    private domain: string = 'cooperado';

    constructor(private settingsService: SettingsService) { }

    add(member: CooperativeMember) {
        const body = {
            name: member.name,
            cooperative_id: member.cooperative_id,
            address: member.address,
            cpf: member.cpf,
            dap_caf_code: member.dap_caf_code,
            dap_caf_registration_date: member.dap_caf_registration_date,
            dap_caf_expiration_date: member.dap_caf_expiration_date,
            pf_type: member.pf_type,
            production_type: member.production_type,
            is_dap: member.is_dap,
            is_male: member.is_male,
            is_active: true
        };

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

    getByDapCafCPF(dapCafCPF: string): Observable<any> {
        const url = `${this.domain}/obter-por-dap-caf-cpf/${dapCafCPF}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    update(member: CooperativeMember) {
        const body = {
            id: member.id,
            name: member.name,
            cooperative_id: member.cooperative_id,
            address: member.address,
            cpf: member.cpf,
            dap_caf_code: member.dap_caf_code,
            dap_caf_registration_date: member.dap_caf_registration_date,
            dap_caf_expiration_date: member.dap_caf_expiration_date,
            pf_type: member.pf_type,
            production_type: member.production_type,
            is_dap: member.is_dap,
            is_male: member.is_male,
            is_active: member.is_active
        };

        return this.settingsService.executePut(this.domain, body);
    }
}
