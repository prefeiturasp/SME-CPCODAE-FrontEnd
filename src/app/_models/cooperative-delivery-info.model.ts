export interface CooperativeDeliveryInfo {
    id: string;
    city_id: number;
    cooperative_id: string;
    public_call_id: string;
    public_call_answer_id: string;
    food_id: string;
    name: string;
    acronym: string;
    cnpj: string;
    location: string;
    city_members_total: number;
    daps_fisicas_total: number;
    indigenous_community_total: number;
    pnra_settlement_total: number;
    quilombola_community_total: number;
    other_family_agro_total: number;
    only_woman: boolean;
    total_delivered: number;
    total_delivered_percentage: number;
    total_proposal: number;
    total_proposal_edited?: number;
    total_price: number;

    color_class: string;
    session_date_color_class: string;
    session_date_percentage: number;
    
    classification: CooperativeDeliveryInfoClassification;
    delivery_progress: CooperativeDeliveryInfoProgress[];

    is_selected: boolean;
    members_validated: boolean;
    was_chosen: boolean;
    was_confirmed: boolean;

    state_acronym: string;
}

export class CooperativeDeliveryInfoClassification {
    good_location: boolean;
    inclusive_cooperative: boolean;
    is_organic: boolean;
    is_singular: boolean;
    daps_percentage: boolean;

    good_location_type: string;
    inclusive_cooperative_percentage: number;
    daps_percentage_proportion: number;

    constructor() {
        this.good_location = false;
        this.inclusive_cooperative = false;
        this.is_organic = false;
        this.is_singular = false;
        this.daps_percentage = false;

        this.good_location_type = '';
        this.inclusive_cooperative_percentage = 0;
        this.daps_percentage_proportion = 0;
    }
}

export class CooperativeDeliveryInfoProgress {
    id: string;
    delivery_date: Date;
    delivered_date: Date | null;
    delivery_percentage: number;
    delivery_quantity: number;
    delivered_quantity: number | null;
    was_delivered: boolean;
    enable_to_confirm: boolean;

    constructor() {
        this.id = '';
        this.delivery_date = new Date();
        this.delivered_date = null;
        this.delivery_percentage = 0;
        this.delivery_quantity = 0;
        this.delivered_quantity = null;
        this.was_delivered = false;
        this.enable_to_confirm = true;
    }
}