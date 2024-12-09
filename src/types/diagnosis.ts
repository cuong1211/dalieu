export interface Disease {
    id: number;
    code: string;
    name: string;
    symptom: string;
    treatment: string;
    created_at: string;
    updated_at: string;
}

export interface DiagnosisInfo {
    main?: Disease[][];
    sub?: Disease[][];
}

export interface PatientDiagnosis {
    name: string;
    age: string;
    gender: string;
    phone: string;
    address: string;
    symptom: string;
    info: DiagnosisInfo;
    result: string;
    image: string;
}

export interface DiagnosisResponse {
    message: string;
    data: PatientDiagnosis;
}

export interface Symptom {
    id: number;
    answer: boolean;
}

export interface DiagnosisPayload {
    diseases: number[];
    symptoms: Symptom[];
}

export interface AdditionalDiagnosisResponse {
    status: boolean;
    data: Disease[];
    result: string;
}

export interface DiagnosisForm {
    id: number;
    name: string;
    birthday: string;
    gender: string;
    id_number: string;
    phone: string;
    email: string;
    address: string;
    symptoms: string;
    image: File | null;
}
export interface SymptomQuestion {
    text: string;
    answers: {
        id: number;
        text: string;
    }[];
}