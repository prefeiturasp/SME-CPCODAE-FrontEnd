import { CooperativeDeliveryInfo } from "./cooperative-delivery-info.model";
import { PublicCallDocument } from "./public-call-document.model";
import { PublicCallFood } from "./public-call-food.model";

export class PublicCall {
    id: string;
    number: string;
    name: string;
    type: string;
    agency: string;
    process: string;
    registration_start_date: Date;
    registration_end_date: Date;
    public_session_date: Date;
    public_session_place: string;
    public_session_url: string;
    notice_url: string;
    notice_object: string;
    delivery_information: string;
    extra_information?: string;
    is_active: boolean;

    status: number;
    status_name?: string;

    city_id?: number;

    documents: PublicCallDocument[];
    foods: PublicCallFood[];
    deliveryInfo: CooperativeDeliveryInfo;

    showParticipateButton: boolean;

    public_session_date_greater_than_today: boolean;

    constructor() {
        this.id = '';
        this.number = '';
        this.name = '';
        this.type = '';
        this.agency = '';
        this.process = '';
        this.registration_start_date = new Date();
        this.registration_end_date = new Date();
        this.public_session_date = new Date();
        this.public_session_place = '';
        this.public_session_url = '';
        this.notice_url = '';
        this.notice_object = '';
        this.delivery_information = '';

        this.is_active = true;

        this.status = 1;

        this.documents = [];
        this.foods = [];
        this.deliveryInfo = new CooperativeDeliveryInfo();

        this.showParticipateButton = false;
        this.public_session_date_greater_than_today = false;
    }
}