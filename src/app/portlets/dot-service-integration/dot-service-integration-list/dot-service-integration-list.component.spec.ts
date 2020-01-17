import { of } from 'rxjs';
import { async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';
import { ActivatedRoute } from '@angular/router';
import { DOTTestBed } from '@tests/dot-test-bed';
import { DotServiceIntegrationListComponent } from './dot-service-integration-list.component';
import { InputTextModule } from 'primeng/primeng';
import { DotServiceIntegrationListResolver } from './dot-service-integration-list-resolver.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { DotServiceIntegrationCardModule } from './dot-service-integration-card/dot-service-integration-card.module';
import { By } from '@angular/platform-browser';
import { DotServiceIntegrationCardComponent } from './dot-service-integration-card/dot-service-integration-card.component';

const routeDatamock = {
    integrationServices: [
        {
            integrationsCount: 0,
            serviceKey: 'google-calendar',
            name: 'Google Calendar',
            description: "It's a tool to keep track of your life's events",
            iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg'
        },
        {
            integrationsCount: 1,
            serviceKey: 'asana',
            name: 'Asana',
            description: "It's asana to keep track of your asana events",
            iconUrl: '/dA/792c7c9f-6b6f-427b-80ff-1643376c9999/photo/mountain-persona.jpg'
        }
    ]
};
class ActivatedRouteMock {
    get data() {
        return of(routeDatamock);
    }
}

describe('DotServiceIntegrationListComponent', () => {
    let component: DotServiceIntegrationListComponent;
    let fixture: ComponentFixture<DotServiceIntegrationListComponent>;
    let routerService: DotRouterService;

    const messageServiceMock = new MockDotMessageService({
        'service.integration.search.placeholder': 'Search'
    });

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        component: DotServiceIntegrationListComponent,
                        path: ''
                    }
                ]),
                DotServiceIntegrationCardModule,
                InputTextModule
            ],
            declarations: [DotServiceIntegrationListComponent],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                {
                    provide: ActivatedRoute,
                    useClass: ActivatedRouteMock
                },
                {
                    provide: DotRouterService,
                    useClass: MockDotRouterService
                },
                DotServiceIntegrationListResolver
            ]
        });
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotServiceIntegrationListComponent);
        component = fixture.debugElement.componentInstance;
        routerService = fixture.debugElement.injector.get(DotRouterService);
        fixture.detectChanges();
    });

    it('should set Service Integration from resolver', () => {
        expect(component.serviceIntegrations).toBe(routeDatamock.integrationServices);
        expect(component.serviceIntegrationsCopy).toEqual(routeDatamock.integrationServices);
    });

    it('should contain 2 service configurations', () => {
        expect(fixture.debugElement.queryAll(By.css('dot-service-integration-card')).length).toBe(
            2
        );
    });

    it('should set messages to Search Input', () => {
        expect(fixture.debugElement.query(By.css('input')).nativeElement.placeholder).toBe(
            component.messagesKey['service.integration.search.placeholder']
        );
    });

    it('should set integration data to service Card', () => {
        expect(
            fixture.debugElement.queryAll(By.css('dot-service-integration-card'))[0]
                .componentInstance.serviceIntegration
        ).toEqual(routeDatamock.integrationServices[0]);
    });

    it('should redirect to detail configuration list page when service Card clicked', () => {
        const card: DotServiceIntegrationCardComponent = fixture.debugElement.queryAll(
            By.css('dot-service-integration-card')
        )[0].componentInstance;
        card.actionFired.emit(component.serviceIntegrations[0].serviceKey);
        expect(routerService.gotoPortlet).toHaveBeenCalledWith(
            `/integration-services/${component.serviceIntegrations[0].serviceKey}`
        );
    });
});
