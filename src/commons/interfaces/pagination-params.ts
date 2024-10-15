export interface IPaginationParams {
    page?: number;
    limit?: number;
    all?: boolean;
    search?: string;
    is_deleted_too?: boolean;
    is_deleted_only?: boolean;
    order?: string;
    load_previous_pages?: boolean;
    specific_pages?: number[];
}
