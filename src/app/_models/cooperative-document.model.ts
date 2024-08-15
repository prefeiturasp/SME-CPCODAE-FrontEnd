export class CooperativeDocument {
    id?: string;
    creation_date?: Date;
    cooperative_id?: string;
    document_type_id?: string;
    food_id?: string;
    public_call_id?: string;
    document_type_name?: string;
    document_path?: string;
    file_base_64?: string;
    file_name?: string;
    file_size?: string;
    is_current?: boolean;
    is_reviewed?: boolean;
    application?: number;

    reviewer_name?: string;
    reviewed_date?: Date;
}

export class CooperativeDocumentGroupedDate {
    creation_date?: Date;
    documents: CooperativeDocument[] = [];
}