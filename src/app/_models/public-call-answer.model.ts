import { CooperativeDocument } from "src/app/_models/cooperative-document.model";

export class PublicCallAnswer {
    id: string;

    categories: PublicCallCategoryAnswer[];

    constructor() {
        this.id = '';
        this.categories = [];
    }
}

export class PublicCallCategoryAnswer {
    id: string;
    cooperative_id: string;
    public_call_id: string;
    members_validated: boolean;
    members: PublicCallCategoryAnswerMember[];
    foods: PublicCallFoodCategoryAnswer[];

    constructor(public_call_id: string, cooperative_id: string) {
        this.cooperative_id = cooperative_id;
        this.public_call_id = public_call_id;
        this.id = '';
        this.members = [];
        this.members_validated = false;
        this.foods = [];
    }
}

export class PublicCallFoodCategoryAnswer {
  food_id: string;
  food_name: string;
  city_id: number;
  city_members_total: number;
  daps_fisicas_total: number;
  indigenous_community_total: number;
  pnra_settlement_total: number;
  quilombola_community_total: number;
  other_family_agro_total: number;
  is_organic: boolean;
  documents: CooperativeDocument[];
  members: any[];
  total_proposto: number;
  quantidade_proposta: number;

  constructor(food_id: string) {
    this.food_id = food_id;
    this.food_name = '';
    this.city_id = 0;
    this.city_members_total = 0;
    this.daps_fisicas_total = 0;
    this.indigenous_community_total = 0;
    this.pnra_settlement_total = 0;
    this.quilombola_community_total = 0;
    this.other_family_agro_total = 0;
    this.is_organic = false;
    this.documents = [];
    this.members = [];
    this.total_proposto = 0;
    this.quantidade_proposta = 0;
  }
}

export class PublicCallCategoryAnswerMember {
    id: string;
    name: string;
    cpf: string;
    dap_caf_code: string;
    quantity: number;
    price: number;

    food_id: string;
    food_name: string;
    formatted_price: string;
    formatted_quantity: string;
    formatted_total: string;
    is_organic: boolean;

    constructor() {
        this.id = '';
        this.name = '';
        this.cpf = '';
        this.dap_caf_code = '';
        this.quantity = 0;
        this.price = 0;

        this.food_id = '';
        this.food_name = '';
        this.formatted_price = '';
        this.formatted_quantity = '';
        this.formatted_total = '';
        this.is_organic = false;
    }
}

export class MemberInfo {
    city_id: number;
    city_members_total: number;
    daps_fisicas_total: number;
    indigenous_community_total: number;
    pnra_settlement_total: number;
    quilombola_community_total: number;
    other_family_agro_total: number;
    state_acronym: string;
    total: number;
  
    constructor() {
      this.city_id = 0;
      this.city_members_total = 0;
      this.daps_fisicas_total = 0;
      this.indigenous_community_total = 0;
      this.pnra_settlement_total = 0;
      this.quilombola_community_total = 0;
      this.other_family_agro_total = 0;
      this.state_acronym = 'SP';
      this.total = 0;
    }
}
