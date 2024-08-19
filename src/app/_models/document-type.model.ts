export class SMEDocumentType
{
    id: string;
    name: string;
    application_text?: string;
    application: number;
    is_active: boolean;

    constructor() {
        this.id = '';
        this.name = '';
        this.application = 0;
        this.is_active = true;
    }
}