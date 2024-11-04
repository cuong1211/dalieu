// types/patient.ts
export interface Disease {
    id: number;
    name: string;
    treatment?: string;
}

export interface DiagnosisInfo {
    sub: Disease[][];
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