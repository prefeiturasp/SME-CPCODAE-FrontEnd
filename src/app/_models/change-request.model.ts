export class ChangeRequest
{
    id: string;
    cooperative_id: string;
    food_id: string;
    public_call_id: string;
    message: string;
    title: string;
    creation_date: Date;
    response_date: Date;
    requires_new_upload: boolean;
    not_visible: boolean;
    is_response: boolean;

    constructor() {
        this.id = '';
        this.cooperative_id = '';
        this.food_id = '';
        this.public_call_id = '';
        this.message = '';
        this.title = '';
        this.creation_date = new Date();
        this.response_date = new Date();
        this.requires_new_upload = false;
        this.not_visible = false;
        this.is_response = true;
    }
}