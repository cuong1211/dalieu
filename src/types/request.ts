export interface DermatologyRequestForm {
    id: number;
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email: string;
    address: string;
    symptoms: string;
    symptomsStartDate: string;
    previousTreatments: string;
    allergies: string;
    images: string[];
    preferredDateTime: string;
    doctorId: number | null;
    departmentId: number;
  }