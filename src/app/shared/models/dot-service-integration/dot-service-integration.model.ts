export interface DotServiceIntegration {
    description: string;
    hosts?: DotServiceIntegrationHost[];
    iconUrl: string;
    integrationsCount: number;
    name: string;
    serviceKey: string;
}

export interface DotServiceIntegrationHost {
    hostId: string;
    hostName: string;
}
