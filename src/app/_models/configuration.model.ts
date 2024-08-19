export class SMEConfiguration
{
    id: string;
    name: string;
    value: string;
    is_active: boolean;

    constructor() {
        this.id = '';
        this.name = '';
        this.value = '';
        this.is_active = true;
    }
}