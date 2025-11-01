// Types cho Chat Diagnosis API

export interface DiseaseCandidate {
    disease: string;
    probability: number;
    rationale: string;
    source: string;
    client_prob?: number;
    description_prob?: number;
    previous_prob?: number;
    new_evidence_prob?: number;
    change?: number;
}

export interface MergeInfo {
    merged: boolean;
    client_diseases_count: number;
    description_diseases_count: number;
    final_count: number;
}

export interface BayesianInfo {
    top_probability: number;
    significant_changes: Array<{
        disease: string;
        change: number;
        direction: string;
    }>;
}

export interface DiagnosisStartRequest {
    description: string;
    image?: string; // base64 string
    // Patient information (all optional)
    patient_info?: {
        name?: string;
        age?: string;
        gender?: string;
        identification?: string;
        phone?: string;
        email?: string;
        address?: string;
    };
}

export interface DiagnosisStartResponse {
    finished: boolean;
    session_id: string;
    question: string;
    symptoms: string[];
    top_5_diseases: DiseaseCandidate[];
    candidates: DiseaseCandidate[];
    confidence: string;
    merge_info: MergeInfo;
}

export interface DiagnosisRespondRequest {
    session_id: string;
    answer: string;
    new_symptoms: string[];
}

export interface DiagnosisRespondResponse {
    finished: boolean;
    session_id: string;
    question: string;
    symptoms: string[];
    new_symptoms_detected?: string[];
    top_5_diseases: DiseaseCandidate[];
    candidates: DiseaseCandidate[];
    questions_asked: number;
    confidence: string;
    bayesian_info?: BayesianInfo;
}

export interface ChatMessage {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
    metadata?: {
        symptoms?: string[];
        top_5_diseases?: DiseaseCandidate[];
        new_symptoms_detected?: string[];
        questions_asked?: number;
    };
}

export interface DiagnosisSession {
    sessionId: string;
    finished: boolean;
    symptoms: string[];
    messages: ChatMessage[];
    top5Diseases: DiseaseCandidate[];
    questionsAsked: number;
    maxQuestions: number;
}
