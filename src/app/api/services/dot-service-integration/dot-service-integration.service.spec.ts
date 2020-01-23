import { DotServiceIntegrationService } from './dot-service-integration.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { Response, ConnectionBackend, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';

const mockDotServiceIntegration = [
    {
        configurationsCount: 0,
        key: 'google-calendar',
        name: 'Google Calendar',
        description: "It's a tool to keep track of your life's events",
        iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg'
    },
    {
        configurationsCount: 1,
        key: 'asana',
        name: 'Asana',
        description: "It's asana to keep track of your asana events",
        iconUrl: '/dA/792c7c9f-6b6f-427b-80ff-1643376c9999/photo/mountain-persona.jpg'
    }
];

describe('DotServiceIntegrationService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotServiceIntegrationService]);
        this.dotServiceIntegrationService = this.injector.get(DotServiceIntegrationService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => {
            this.lastConnection = connection;
        });
    });

    it('should get service integrations', () => {
        const url = 'v1/service/integration';

        this.dotServiceIntegrationService.get().subscribe((services: DotServiceIntegration[]) => {
            expect(services).toEqual(mockDotServiceIntegration);
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: mockDotServiceIntegration
                    }
                })
            )
        );

        expect(this.lastConnection.request.method).toBe(RequestMethod.Get);
        expect(this.lastConnection.request.url).toContain(url);
    });

    it('should get a specific service integrations', () => {
        const serviceKey = '1';
        const url = `v1/service/integration/${serviceKey}`;

        this.dotServiceIntegrationService
            .getConfiguration(serviceKey)
            .subscribe((service: DotServiceIntegration) => {
                expect(service).toEqual(mockDotServiceIntegration[0]);
            });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: mockDotServiceIntegration[0]
                    }
                })
            )
        );

        expect(this.lastConnection.request.method).toBe(RequestMethod.Get);
        expect(this.lastConnection.request.url).toContain(url);
    });

    it('should delete a specific configuration from a service', () => {
        const serviceKey = '1';
        const hostId = 'abc';
        const url = `v1/service/integration/${serviceKey}/${hostId}`;

        this.dotServiceIntegrationService
            .deleteConfiguration(serviceKey, hostId)
            .subscribe((response: string) => {
                expect(response).toEqual('ok');
            });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: 'ok'
                    }
                })
            )
        );

        expect(this.lastConnection.request.method).toBe(RequestMethod.Delete);
        expect(this.lastConnection.request.url).toContain(url);
    });

    it('should delete all configurations from a service', () => {
        const serviceKey = '1';
        const url = `v1/service/integration/${serviceKey}`;

        this.dotServiceIntegrationService
            .deleteAllConfigurations(serviceKey)
            .subscribe((response: string) => {
                expect(response).toEqual('ok');
            });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: 'ok'
                    }
                })
            )
        );

        expect(this.lastConnection.request.method).toBe(RequestMethod.Delete);
        expect(this.lastConnection.request.url).toContain(url);
    });
});
