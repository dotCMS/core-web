import { of, Observable } from 'rxjs';
import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';
import { ActivatedRoute } from '@angular/router';
import { DOTTestBed } from '@tests/dot-test-bed';
import { DotServiceIntegrationConfigurationComponent } from './dot-service-integration-configuration.component';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { DotCopyButtonModule } from '@components/dot-copy-button/dot-copy-button.module';
import { DotActionButtonModule } from '@components/_common/dot-action-button/dot-action-button.module';
import { InputTextModule, ButtonModule } from 'primeng/primeng';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { DotServiceIntegrationConfigurationResolver } from './dot-service-integration-configuration-resolver.service';
import { By } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { DotAlertConfirmService } from '@services/dot-alert-confirm/dot-alert-confirm.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { CommonModule } from '@angular/common';
import { DotServiceIntegrationConfigurationListModule } from './dot-service-integration-configuration-list/dot-service-integration-configuration-list.module';
import { PaginatorService } from '@services/paginator';

const messages = {
    'service.integration.key': 'Key',
    'service.integration.configurations': 'Configurations',
    'service.integration.no.configurations': 'No Configurations',
    'service.integration.confirmation.delete.all.button': 'Delete All',
    'service.integration.confirmation.title': 'Are you sure?',
    'service.integration.confirmation.description.show.more': 'Show More',
    'service.integration.confirmation.description.show.less': 'Show Less',
    'service.integration.confirmation.delete.all.message': 'Delete all?',
    'service.integration.confirmation.accept': 'Ok',
    'service.integration.search.placeholder': 'Search by name'
};

const sites = [
    {
        configured: true,
        id: '123',
        name: 'demo.dotcms.com'
    },
    {
        configured: false,
        id: '456',
        name: 'host.example.com'
    }
];

const serviceData = {
    configurationsCount: 2,
    key: 'google-calendar',
    name: 'Google Calendar',
    description: `It is a tool to keep track of your life\'s events`,
    iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg',
    sites
};

const routeDatamock = {
    data: { service: serviceData, messages }
};
class ActivatedRouteMock {
    get data() {
        return of(routeDatamock);
    }
}

@Injectable()
class MockDotServiceIntegrationService {
    deleteConfiguration(_configurationId: string): Observable<string> {
        return of('');
    }
    deleteAllConfigurations(): Observable<string> {
        return of('');
    }
}

describe('DotServiceIntegrationConfigurationComponent', () => {
    let component: DotServiceIntegrationConfigurationComponent;
    let fixture: ComponentFixture<DotServiceIntegrationConfigurationComponent>;
    let dialogService: DotAlertConfirmService;
    let paginationService: PaginatorService;
    let integrationService: DotServiceIntegrationService;
    let routerService: DotRouterService;

    const messageServiceMock = new MockDotMessageService(messages);

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        component: DotServiceIntegrationConfigurationComponent,
                        path: ''
                    }
                ]),
                InputTextModule,
                ButtonModule,
                CommonModule,
                DotAvatarModule,
                DotActionButtonModule,
                DotCopyButtonModule,
                DotServiceIntegrationConfigurationListModule
            ],
            declarations: [DotServiceIntegrationConfigurationComponent],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                {
                    provide: ActivatedRoute,
                    useClass: ActivatedRouteMock
                },
                {
                    provide: DotServiceIntegrationService,
                    useClass: MockDotServiceIntegrationService
                },
                {
                    provide: DotRouterService,
                    useClass: MockDotRouterService
                },
                DotServiceIntegrationConfigurationResolver,
                PaginatorService
            ]
        });
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotServiceIntegrationConfigurationComponent);
        component = fixture.debugElement.componentInstance;
        dialogService = fixture.debugElement.injector.get(DotAlertConfirmService);
        paginationService = fixture.debugElement.injector.get(PaginatorService);
        integrationService = fixture.debugElement.injector.get(DotServiceIntegrationService);
        routerService = fixture.debugElement.injector.get(DotRouterService);
    });

    describe('With integrations count', () => {
        beforeEach(() => {
            spyOn(paginationService, 'setExtraParams');
            spyOn(paginationService, 'getWithOffset').and.returnValue(of(serviceData));
            spyOn(component.searchInput.nativeElement, 'focus');
            fixture.detectChanges();
        });

        it('should set Service Integration from resolver', () => {
            expect(component.serviceIntegration).toBe(serviceData);
            expect(component.messagesKey).toBe(messages);
        });

        it('should set onInit Pagination Service with right values', () => {
            expect(paginationService.url).toBe(
                `v1/service-integrations/${component.serviceIntegration.key}`
            );
            expect(paginationService.paginationPerPage).toBe(component.paginationPerPage);
            expect(paginationService.sortField).toBe('name');
            expect(paginationService.sortOrder).toBe(1);
            expect(paginationService.setExtraParams).toHaveBeenCalledWith('filter', '');
        });

        it('should call first pagination call onInit', () => {
            expect(paginationService.getWithOffset).toHaveBeenCalledWith(0);
        });

        it('should input search be focused on init', () => {
            expect(component.searchInput.nativeElement.focus).toHaveBeenCalledTimes(1);
        });

        it('should set messages/values in DOM correctly', () => {
            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__service-name')
                ).nativeElement.innerText
            ).toBe(component.serviceIntegration.name);

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__service-key')
                ).nativeElement.textContent
            ).toContain(
                `${component.messagesKey['service.integration.key']} ${component.serviceIntegration.key}`
            );

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__configurations')
                ).nativeElement.textContent
            ).toContain(
                `${component.serviceIntegration.configurationsCount} ${component.messagesKey['service.integration.configurations']}`
            );

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__description')
                ).nativeElement.innerText
            ).toContain(`${component.serviceIntegration.description}`);

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__action_header input')
                ).nativeElement.placeholder
            ).toContain(component.messagesKey['service.integration.search.placeholder']);

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__action_header button')
                ).nativeElement.innerText
            ).toContain(
                component.messagesKey[
                    'service.integration.confirmation.delete.all.button'
                ].toUpperCase()
            );
        });

        it('should have Dot-Copy-Button with serviceKey value', () => {
            const copyBtn = fixture.debugElement.query(By.css('dot-copy-button')).componentInstance;
            expect(copyBtn.copy).toBe(component.serviceIntegration.key);
            expect(copyBtn.label).toBe(component.serviceIntegration.key);
        });

        it('should have Dot-Avatar with correct values', () => {
            const avatar = fixture.debugElement.query(By.css('dot-avatar')).componentInstance;
            expect(avatar.size).toBe(112);
            expect(avatar.url).toBe(component.serviceIntegration.iconUrl);
        });

        it('should have dot-service-integration-configuration-list with correct values', () => {
            const listComp = fixture.debugElement.query(
                By.css('dot-service-integration-configuration-list')
            ).componentInstance;
            expect(listComp.siteConfigurations).toBe(component.serviceIntegration.sites);
            expect(listComp.disabledLoadDataButton).toBe(true);
            expect(listComp.itemsPerPage).toBe(component.paginationPerPage);
        });

        it('should dot-service-integration-configuration-list emit action to load more data', () => {
            const listComp = fixture.debugElement.query(
                By.css('dot-service-integration-configuration-list')
            ).componentInstance;
            listComp.loadData.emit({ first: 10 });
            expect(paginationService.getWithOffset).toHaveBeenCalledWith(10);
        });

        it('should redirect to edit configuration page on Edit action', () => {
            const listComp = fixture.debugElement.query(
                By.css('dot-service-integration-configuration-list')
            ).componentInstance;
            listComp.goto.emit(sites[0]);
            expect(routerService.gotoPortlet).toHaveBeenCalledWith(
                `/integration-services/${component.serviceIntegration.key}/edit/${sites[0].id}`
            );
        });

        it('should redirect to create configuration page on create action', () => {
            const listComp = fixture.debugElement.query(
                By.css('dot-service-integration-configuration-list')
            ).componentInstance;
            listComp.goto.emit(sites[1]);
            expect(routerService.gotoPortlet).toHaveBeenCalledWith(
                `/integration-services/${component.serviceIntegration.key}/create/${sites[1].id}`
            );
        });

        it('should open confirm dialog and delete All configurations', () => {
            const deleteAllBtn = fixture.debugElement.query(
                By.css('.dot-service-integration-configuration__action_header button')
            );

            spyOn(dialogService, 'confirm').and.callFake((conf) => {
                conf.accept();
            });

            spyOn(integrationService, 'deleteAllConfigurations').and.returnValue(of(null));

            deleteAllBtn.triggerEventHandler('click', null);
            expect(dialogService.confirm).toHaveBeenCalledTimes(1);
            expect(integrationService.deleteAllConfigurations).toHaveBeenCalledWith(
                component.serviceIntegration.key
            );
        });

        it('should delete a specific configuration', () => {
            spyOn(integrationService, 'deleteConfiguration').and.returnValue(of(null));
            const listComp = fixture.debugElement.query(
                By.css('dot-service-integration-configuration-list')
            ).componentInstance;
            listComp.delete.emit(sites[0]);

            expect(integrationService.deleteConfiguration).toHaveBeenCalledWith(
                component.serviceIntegration.key,
                sites[0].id
            );
        });

        it('should call service integration filter on search', fakeAsync(() => {
            component.searchInput.nativeElement.value = 'test';
            component.searchInput.nativeElement.dispatchEvent(new Event('keyup'));
            tick(550);
            expect(paginationService.setExtraParams).toHaveBeenCalledWith('filter', 'test');
            expect(paginationService.getWithOffset).toHaveBeenCalled();
        }));
    });

    describe('With NO integrations count', () => {
        beforeEach(() => {
            routeDatamock.data.service = {
                ...serviceData,
                configurationsCount: 0
            };
            fixture.detectChanges();
        });

        it('should show No configurations label', () => {
            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration__configurations')
                ).nativeElement.textContent
            ).toContain(component.messagesKey['service.integration.no.configurations']);
        });
    });
});
