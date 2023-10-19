export class CooperativeDeliveryInfo {
    id: string;
    cooperative_id: string;
    public_call_id: string;
    public_call_answer_id: string;
    food_id: string;
    name: string;
    location: string;
    city_members_total: number;
    daps_fisicas_total: number;
    indigenous_community_total: number;
    pnra_settlement_total: number;
    quilombola_community_total: number;
    other_family_agro_total: number;
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

    constructor() {
        this.id = '';
        this.cooperative_id = '';
        this.public_call_id = '';
        this.public_call_answer_id = '';
        this.food_id = '';
        this.name = '';
        this.location = '';
        this.city_members_total = 0;
        this.daps_fisicas_total = 0;
        this.indigenous_community_total = 0;
        this.pnra_settlement_total = 0;
        this.quilombola_community_total = 0;
        this.other_family_agro_total = 0;
        this.total_delivered = 0;
        this.total_delivered_percentage = 0;
        this.total_proposal = 0;
        this.total_price = 0;

        this.classification = new CooperativeDeliveryInfoClassification();
        this.delivery_progress = [];

        this.color_class = '';
        this.session_date_color_class = '';
        this.session_date_percentage = 0;
        this.is_selected = false;
        this.members_validated = false;
        this.was_chosen = false;
    }
}

export class CooperativeDeliveryInfoClassification {
    good_location: boolean;
    inclusive_cooperative: boolean;
    is_organic: boolean;
    daps_percentage: boolean;

    good_location_type: string;
    inclusive_cooperative_percentage: number;
    daps_percentage_proportion: number;

    constructor() {
        this.good_location = false;
        this.inclusive_cooperative = false;
        this.is_organic = false;
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