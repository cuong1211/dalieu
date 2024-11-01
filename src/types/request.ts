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

// Sửa lại initialFormData
