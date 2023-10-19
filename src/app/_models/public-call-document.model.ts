export class PublicCallDocument {
    id?: string;
    document_type_id?: string;
    food_id?: string;
    public_call_id?: string;
    document_type_name?: string;
    application?: number;
}

export class PublicCallDocumentFoods {
    document_type_id!: string;
    document_type_name!: string;
    foods: PublicCallDocumentFood[] = [];
}

export class PublicCallDocumentFood {
    food_id!: string;
    is_associated!: boolean;
}