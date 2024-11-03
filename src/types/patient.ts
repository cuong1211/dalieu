export interface Patient {
    id: number;
    name: string;
    identification: string;
    phone: string;
    address: string;
    age: number;
    gender: 'male' | 'female';
    symptom: string;
    result: string;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    created_by: number | null;
    updated_by: number | null;
    deleted_by: number | null;
}
export interface MedicalHistory {
    id: number;
    examination_date: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    doctor_name: string;
    department: string;
    next_appointment?: string;
    status: 'completed' | 'pending' | 'cancelled';
}