import { CooperativeDocument } from "./cooperative-document.model";

export class Cooperative {
    id: string;
    acronym: string;
    address: CooperativeAddress;
    // bank: CooperativeBank;
    cnpj: string;
    cnpj_central: string;
    cnpj_formatted?: string;
    dap_caf_code: string;
    email: string;
    name: string;
    phone: string;
    pj_type: number;
    production_type: number;
    dap_caf_registration_date: Date;
    dap_caf_expiration_date: Date;
    status: number;
    daps_fisicas_total: number;
    indigenous_community_total: number;
    pnra_settlement_total: number;
    quilombola_community_total: number;
    other_family_agro_total: number;
    legal_representative: CooperativeLegalRepresentative;
    is_dap: boolean;
    is_active: boolean;

    documents: CooperativeDocument[];
    members: CooperativeMember[];

    constructor() {
        this.id = '';
        this.acronym = '';
        this.address = new CooperativeAddress();
        //this.bank = new CooperativeBank();
        this.cnpj = '';
        this.cnpj_central = '';
        this.dap_caf_code = '';
        this.email = '';
        this.name = '';
        this.phone = '';
        this.pj_type = 0;
        this.production_type = 0;
        this.dap_caf_registration_date = new Date();
        this.dap_caf_expiration_date = new Date();
        this.status = 0;
        this.daps_fisicas_total = 0;
        this.indigenous_community_total = 0;
        this.pnra_settlement_total = 0;
        this.quilombola_community_total = 0;
        this.other_family_agro_total = 0;
        this.legal_representative = new CooperativeLegalRepresentative();
        this.is_dap = true;
        this.is_active = true;

        this.documents = [];
        this.members = [];
    }
}

export class CooperativeAddress {
    cep: string;
    city_id: number | null;
    complement?: string;
    district: string;
    number: string;
    street: string;

    constructor() {
        this.street = '';
        this.cep = '';
        this.city_id = 0;
        this.district = '';
        this.number = '';
    }
}

// export class CooperativeBank {
//     code: string;
//     name: string;
//     agency: string;
//     account_number: string;

//     constructor() {
//         this.code = '';
//         this.name = '';
//         this.agency = '';
//         this.account_number = '';
//     }
// }

export class CooperativeLegalRepresentative {
    name: string;
    cpf: string;
    phone: string;
    address: CooperativeAddress;

    constructor() {
        this.name = '';
        this.cpf = '';
        this.phone = '';
        this.address = new CooperativeAddress();
    }
}

export class CooperativeMember {
    id: string;
    cooperative_id?: string;
    address: CooperativeAddress;
    cpf?: string;
    dap_caf_code: string;
    name: string;
    pf_type?: number;
    production_type?: number;
    dap_caf_registration_date: Date;
    dap_caf_expiration_date: Date;
    is_dap: boolean;
    is_male: boolean;
    is_active: boolean;

    total_year_supplied_value: number;

    constructor() {
        this.id = '';
        this.address = new CooperativeAddress();
        this.name = '';
        this.dap_caf_code = '';
        this.dap_caf_registration_date = new Date();
        this.dap_caf_expiration_date = new Date();
        this.is_dap = true;
        this.is_male = true;
        this.is_active = true;
        this.total_year_supplied_value = 0;
    }
}

export interface CooperativeSimplified {
    id: string;
    name: string;
}