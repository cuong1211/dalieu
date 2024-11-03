// Sửa lại interface cho form
export interface DermatologyRequestForm {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  id_number: string;
  phone: string;
  email: string;
  address: string;
  symptoms: string;
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
// Sửa lại initialFormData
