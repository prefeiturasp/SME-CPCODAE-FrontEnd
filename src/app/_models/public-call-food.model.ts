export class PublicCallFood {
    id: string;
    category_id: string;
    category_name: string;
    creation_date: Date;
    food_id: string;
    food_name: string;
    is_active: boolean;
    accepts_organic: boolean;
    is_organic: boolean;
    measure_unit: string;
    measure_unit_id: number;
    price: number;
    public_call_id: string;
    quantity: number;

    constructor() {
        this.id = '';
        this.category_id = '';
        this.category_name = '';
        this.creation_date = new Date();
        this.food_id = '';
        this.food_name = '';
        this.is_active = true;
        this.accepts_organic = false;
        this.is_organic = false;
        this.measure_unit = '';
        this.measure_unit_id = 0;
        this.price = 0;
        this.public_call_id = '';
        this.quantity = 0;
    }
}