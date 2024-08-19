import { ChangeRequest } from "./change-request.model";
import { CooperativeDeliveryInfo, CooperativeDeliveryInfoProgress } from "./cooperative-delivery-info.model";

export interface CooperativePublicCallDelivery {
    id: string;
    public_call_answer_id?: string;
    name: string;
    process: string;
    creation_date: Date;
    public_session_date: Date;
    public_session_date_color_class?: string;
    public_session_date_percentage?: number;
    registration_end_date: Date;
    total_proposal?: number;

    status: number;

    food_id: string;
    food_name: string;
    measure_unit: string;
    delivery_info?: CooperativeDeliveryInfo;
    delivery_progress?: CooperativeDeliveryInfoProgress[];
    messages?: ChangeRequest[];

    has_messages?: boolean;
    last_message_is_invisible?: boolean;
    was_chosen: boolean;

    registrationDateIsGreaterThanToday: boolean;
}
