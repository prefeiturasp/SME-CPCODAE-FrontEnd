export class SMEContact
{
    id: string;
    cooperative_name: string;
    public_call_name: string;
    message: string;
    title: string;
    creation_date: Date;

    constructor() {
        this.id = '';
        this.cooperative_name = '';
        this.public_call_name = '';
        this.message = '';
        this.title = '';
        this.creation_date = new Date();
    }
}