export interface Disease {
    id: number;
    code: string;
    name: string;
    symptom: string;
    treatment: string;
    created_by: number | null;
    updated_by: number | null;
    deleted_by: number | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface DiseaseFormData {
    code: string;
    name: string;
    symptom: string;
    treatment: string;
}

export interface DiseasesState {
    diseases: Disease[];
    currentDisease: Disease | null;
    loading: boolean;
    error: string[] | null;
    pagination: PaginationData | null;
}

export interface PaginationData {
    total: number;
    page_size: string | number;
    page_no: number;
    last_page: number;
}