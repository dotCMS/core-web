import { async, ComponentFixture } from '@angular/core/testing';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DotServiceIntegrationConfigurationItemModule } from './dot-service-integration-configuration-item/dot-service-integration-configuration-item.module';
import { DotServiceIntegrationConfigurationListComponent } from './dot-service-integration-configuration-list.component';

const messages = {
    'service.integration.configurations.show.more': 'Show More'
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

describe('DotServiceIntegrationConfigurationListComponent', () => {
    let component: DotServiceIntegrationConfigurationListComponent;
    let fixture: ComponentFixture<DotServiceIntegrationConfigurationListComponent>;

    const messageServiceMock = new MockDotMessageService(messages);

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [CommonModule, ButtonModule, DotServiceIntegrationConfigurationItemModule],
            declarations: [DotServiceIntegrationConfigurationListComponent],
            providers: [{ provide: DotMessageService, useValue: messageServiceMock }]
        });
    }));

    beforeEach(() => {
        fixture = DOTTestBed.createComponent(DotServiceIntegrationConfigurationListComponent);
        component = fixture.debugElement.componentInstance;
        component.itemsPerPage = 10;
        component.siteConfigurations = sites;
    });

    describe('With more data to load', () => {
        beforeEach(() => {
            component.disabledLoadDataButton = false;
            fixture.detectChanges();
        });

        it('should load messages keys', () => {
            expect(component.messagesKey).toBe(messages);
        });

        it('should set messages/values in DOM correctly', () => {
            expect(
                fixture.debugElement.queryAll(
                    By.css('dot-service-integration-configuration-item')
                )[0].componentInstance.site
            ).toBe(component.siteConfigurations[0]);

            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration-list__show-more')
                ).nativeElement.outerText
            ).toBe(
                component.messagesKey['service.integration.configurations.show.more'].toUpperCase()
            );
        });

        it('should emit action for goto when site item clicked', () => {
            spyOn(component.goto, 'emit');
            const siteItem = fixture.debugElement.queryAll(
                By.css('dot-service-integration-configuration-item')
            )[0];

            siteItem.triggerEventHandler('click', sites[0]);
            expect(component.goto.emit).toHaveBeenCalledWith(sites[0]);
        });

        it('should emit action for goto --> Site Item', () => {
            spyOn(component.goto, 'emit');
            const siteItem = fixture.debugElement.queryAll(
                By.css('dot-service-integration-configuration-item')
            )[0].componentInstance;

            siteItem.goto.emit(sites[0]);
            expect(component.goto.emit).toHaveBeenCalledWith(sites[0]);
        });

        it('should emit action for delete --> Site Item', () => {
            spyOn(component.delete, 'emit');
            const siteItem = fixture.debugElement.queryAll(
                By.css('dot-service-integration-configuration-item')
            )[0].componentInstance;

            siteItem.delete.emit(sites[0]);
            expect(component.delete.emit).toHaveBeenCalledWith(sites[0]);
        });

        it('should Load More button be enabled', () => {
            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration-list__show-more')
                ).nativeElement.disabled
            ).toBe(false);
        });

        it('should Load More button emit action', () => {
            spyOn(component.loadData, 'emit');
            const loadMore = fixture.debugElement.query(
                By.css('.dot-service-integration-configuration-list__show-more')
            );

            loadMore.triggerEventHandler('click', {});
            expect(component.loadData.emit).toHaveBeenCalledWith({
                first: component.siteConfigurations.length,
                rows: component.itemsPerPage
            });
        });
    });

    describe('With more data to load', () => {
        beforeEach(() => {
            component.disabledLoadDataButton = true;
            fixture.detectChanges();
        });

        it('should Load More button be enabled', () => {
            expect(
                fixture.debugElement.query(
                    By.css('.dot-service-integration-configuration-list__show-more')
                ).nativeElement.disabled
            ).toBe(true);
        });
    });
});
