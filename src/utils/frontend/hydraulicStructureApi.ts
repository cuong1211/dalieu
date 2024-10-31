import { api } from '../api';
import type { PaginationData } from '@/types/type';
export interface SearchParams {
    name?: string;
    district_id?: number | string;
    commune_id?: number | string;
    year?: number | string;
    last_repair_year?: number | string;
    status?: string;
    page?: number | string;
    limit?: number | string;
    [key: string]: any;
}

export interface ApiResponse<T> {
    status: string;
    data: T[];
    pagination: PaginationData;
}

export interface HydraulicStructure {
    id: number;
    name: string;
    type: number;
    district_name: string;
    commune_name: string;
    year: number | string;
    last_repair_year: number | string;
    status: string;
}

export interface WaterReservior extends HydraulicStructure {
    capacity: number | string;
    basin: number | string;
}

export interface Weir extends HydraulicStructure {
    length: number | string;
    height: number | string;
}

export interface Pump extends HydraulicStructure {
    power: number | string;
    pump_number: number | string;
}

export interface Canal extends HydraulicStructure {
    length: number | string;
    total_length: number | string;
    sturdy_dimension: number | string;
    sturdy_length: number | string;
}

const hydraulicStructureApi = {
    searchWaterReserviors: (params: SearchParams) =>
        api.get<ApiResponse<WaterReservior>>('/search/water_reserviors', { params }),

    searchWeirs: (params: SearchParams) =>
        api.get<ApiResponse<Weir>>('/search/weirs', { params }),

    searchPumps: (params: SearchParams) =>
        api.get<ApiResponse<Pump>>('/search/pump_stations', { params }),

    searchCanals: (params: SearchParams) =>
        api.get<ApiResponse<Canal>>('/search/canals', { params }),

    search: (type: string, params: SearchParams) => {
        switch (type) {
            case 'WaterReservior':
                return hydraulicStructureApi.searchWaterReserviors(params);
            case 'Weir':
                return hydraulicStructureApi.searchWeirs(params);
            case 'Pump':
                return hydraulicStructureApi.searchPumps(params);
            case 'Canal':
                return hydraulicStructureApi.searchCanals(params);
            default:
                throw new Error('Loại công trình không hợp lệ');
        }
    },
};

export default hydraulicStructureApi;