

export interface PaginationData {
    total: number;
    page_size: number;
    page_no: number;
    last_page: number;
}
export enum ConstructionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}