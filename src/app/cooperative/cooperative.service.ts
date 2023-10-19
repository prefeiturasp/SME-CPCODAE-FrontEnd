import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from 'src/app/_services/settings.service';
import { CooperativeDocument } from '../_models/cooperative-document.model';
import { Cooperative, CooperativeMember } from '../_models/cooperative.model';

@Injectable()
export class CooperativeService {
    private domain: string = 'cooperativa';
    private domainActiveDapList: string = 'cooperado-dap';

    public cooperativeChanged: EventEmitter<Cooperative | null> = new EventEmitter();

    constructor(
        private settingsService: SettingsService,
    ) { }

    add(cooperative: any) {
        const body = {
            cnpj: cooperative.cnpj,
            is_dap: cooperative.is_dap,
            dap_caf_code: cooperative.dap_caf_code,
            email: cooperative.email,
            name: cooperative.name,
            password: cooperative.password,
            terms_use_acceptance_ip: cooperative.terms_use_acceptance_ip,
            acronym: cooperative.acronym,
            phone: cooperative.phone,
            cnpj_central: cooperative.cnpj_central,
            confirmEmail: cooperative.confirmEmail,
            confirmPassword: cooperative.confirmPassword,
            pj_type: cooperative.pj_type,
            production_type: cooperative.production_type,
            termosOfUse: cooperative.termosOfUse,
            is_active: cooperative.is_active,
            dap_caf_registration_date: cooperative.dap_caf_registration_date,
            dap_caf_expiration_date: cooperative.dap_caf_expiration_date,
            address: {
              street: cooperative.address_street,
              number: cooperative.address_number,
              cep: cooperative.address_cep,
              district: cooperative.address_district,
              complement: cooperative.address_complement,
              city_id: cooperative.address_city_id
            },
            legal_representative: {
                email: cooperative.legal_representative_email,
                name: cooperative.legal_representative_name,
                cpf: cooperative.legal_representative_cpf,
                phone: cooperative.legal_representative_phone,
                address: {
                    street: cooperative.legal_representative_address_street,
                    number: cooperative.legal_representative_address_number,
                    cep: cooperative.legal_representative_address_cep,
                    district: cooperative.legal_representative_address_district,
                    complement: cooperative.legal_representative_address_complement,
                    city_id: cooperative.legal_representative_address_city_id
              }
            }
        };

        return this.settingsService.executePost(this.domain, body);
    }

    addDocument(document: CooperativeDocument, file_base_64: string, file_size: number) {
        const body = { cooperative_id: document.cooperative_id, document_type_id: document.document_type_id, file_base_64, file_size };
        const url = `${this.domain}/adicionar-documento`;

        return this.settingsService.executePost(url, body);
    }

    addMember(member: CooperativeMember) {
        const body = member;
        const url = `${this.domain}/adicionar-cooperado`;

        return this.settingsService.executePost(url, body);
    }

    checkIfIsAlreadyAnswer(id: string, public_call_id: string): Observable<any> {
        const url = `${this.domain}/${id}/check-is-already-answered/${public_call_id}`;
        return this.settingsService.executeGet(url);
    }

    confirmEmailByToken(token: string) {
        return this.settingsService.executePost(`${this.domain}/email-confirmation/${token}`, {});
    }

    get(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    getByUserId(userId: string): Observable<any> {
        const url = `${this.domain}/obter-por-usuario/${userId}`;
        return this.settingsService.executeGet(url);
    }

    getByUserIdLogin(userId: string): Observable<any> {
        const url = `${this.domain}/obter-por-usuario-login/${userId}`;
        return this.settingsService.executeGet(url);
    }

    getCooperativeDocumentTypes(): Observable<any> {
        const url = `${this.domain}/listar-tipos-documento`;
        return this.settingsService.executeGet(url);
    }

    getMemberByDapCaf(dap_caf_code: string): Observable<any> {
        const url = `${this.domainActiveDapList}/${dap_caf_code}`;
        return this.settingsService.executeGet(url);
    }

    getMessages(): Observable<any> {
        const url = `${this.domain}/messages`;
        return this.settingsService.executeGet(url);
    }

    removeDocument(id: string, cooperative_id: string): Observable<any> {
        const url = `${this.domain}/${cooperative_id}/remover-documento/${id}`;
        return this.settingsService.executeDelete(url);
    }

    removeMember(id: string, cooperative_id: string): Observable<any> {
        const url = `${this.domain}/${cooperative_id}/remover-cooperado/${id}`;
        return this.settingsService.executeDelete(url);
    }

    saveStep1(cooperative: Cooperative): Observable<any> {
        const body = {
            id: cooperative.id,
            acronym: cooperative.acronym,
            address: cooperative.address,
            // bank: cooperative.bank,
            cnpj: cooperative.cnpj,
            cnpj_central: cooperative.cnpj_central,
            dap_caf_code: cooperative.dap_caf_code,
            email: cooperative.email,
            name: cooperative.name,
            phone: cooperative.phone,
            daps_fisicas_total: cooperative.daps_fisicas_total,
            legal_representative: cooperative.legal_representative,
            indigenous_community_total: cooperative.indigenous_community_total,
            pnra_settlement_total: cooperative.pnra_settlement_total,
            quilombola_community_total: cooperative.quilombola_community_total,
            other_family_agro_total: cooperative.other_family_agro_total,
            pj_type: cooperative.pj_type,
            production_type: cooperative.production_type,
            dap_caf_registration_date: cooperative.dap_caf_registration_date,
            dap_caf_expiration_date: cooperative.dap_caf_expiration_date,

            is_dap: cooperative.is_dap
        };

        const url = `${this.domain}/salvar-passo-1`;

        return this.settingsService.executePatch(url, body);
    }

    saveStep3(cooperative_id: string): Observable<any> {
        const url = `${this.domain}/${cooperative_id}/complete-registration`;
        return this.settingsService.executePatch(url, {});
    }
}
