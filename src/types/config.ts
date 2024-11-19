export interface SystemConfig {
    key: string;
    value: string;
}

export interface ConfigState {
    configs: SystemConfig[];
    loading: boolean;
    error: string | null;
}