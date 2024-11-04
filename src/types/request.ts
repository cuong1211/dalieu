// Sửa lại interface cho form
export interface DermatologyRequestForm {
  id: number;
  name: string;
  age: string;
  gender: string;
  identification: string;
  phone: string;
  email: string;
  address: string;
  symptom: string;
  image: File | null; // Thay đổi từ string sang File
}
// types/response.ts

export interface DiseaseInfo {
  id: number;
  name: string;
}

export interface RequestResponse {
  message: string;
  data: {
    name: string;
    age: string;
    gender: string;
    phone: string;
    address: string;
    symptom: string;
    info: {
      sub: Array<DiseaseInfo[]>;
    };
    result: string;
    image: string;
  };
}
export interface Request {
  id: number;
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  symptom: string;
  result: string | null;
  image: string | null;
  created_at: string | null;
  updated_at: string | null;
}
// Sửa lại initialFormData
