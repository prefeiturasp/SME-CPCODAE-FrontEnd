export class SMEFood
{
    id: string;
    category_id: string;
    category_name: string;
    measure_unit: number;
    measure_unit_name: string;
    name: string;
    is_active: boolean;

    constructor() {
        this.id = '';
        this.category_id = '';
        this.category_name = '';
        this.measure_unit = 0;
        this.measure_unit_name = '';
        this.name = '';
        this.is_active = true;
    }
}