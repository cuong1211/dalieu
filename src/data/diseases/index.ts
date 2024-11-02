import type { Disease } from '@/types/disease';
import bachBienData from './bach-bien.json';
import trungCaData from './trung-ca.json';
// Import các file json khác

export interface DiseaseRouteInfo {
    name: string;
    route: string;
    category: string;
}

const diseaseDataMap: Record<string, Disease> = {
    'bach_bien': bachBienData,
    'trungca': trungCaData,
};

export const diseaseCategories = [
    { id: 1, name: 'Bệnh da phổ biến' },
    { id: 2, name: 'Bệnh nấm da' },
    { id: 3, name: 'Rối loạn sắc tố' },
    { id: 4, name: 'Bệnh tự miễn' }
];

export const getDiseaseData = (id: string): Disease | null => {
    console.log('Getting disease data for id:', id); // Debug log
    const disease = diseaseDataMap[id];
    console.log('Found disease:', disease); // Debug log
    return disease || null;
};

export const getAllDiseases = (): Disease[] => {
    return Object.values(diseaseDataMap);
};

export const getDiseasesByCategory = (categoryId: number): Disease[] => {
    const category = diseaseCategories.find(c => c.id === categoryId);
    if (!category) return [];

    return Object.values(diseaseDataMap)
        .filter(disease => disease.category === category.name);
};