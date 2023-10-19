export interface Address {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
}

export interface City {
    id: number;
    name: string;
    state_acronym: string;
}

export interface State {
    id: number;
    name: string;
    acronym: string;
}