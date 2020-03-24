export interface DotServiceIntegration {
    description?: string;
    iconUrl?: string;
    configurationsCount?: number;
    name: string;
    key: string;
    sites?: DotServiceIntegrationSites[];
}

export interface DotServiceIntegrationSites {
    configured?: boolean;
    id: string;
    name: string;
    secrets?: DotServiceIntegrationSecrets[];
}

export interface DotServiceIntegrationSecrets {
    dynamic: boolean;
    hidden: boolean;
    hint: string;
    label: string;
    name: string;
    required: boolean;
    type: string;
    value: string;
}
