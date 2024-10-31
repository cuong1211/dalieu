export interface BaseModel {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  content: any;
  data: T[];
  pagination: {
    total: number;
    page_size: number;
    page_no: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}