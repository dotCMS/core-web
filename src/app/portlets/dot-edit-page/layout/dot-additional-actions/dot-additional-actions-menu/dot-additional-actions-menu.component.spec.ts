import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { IFrameModule } from '../../../../../view/components/_common/iframe/iframe.module';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';
import { DotLegacyAdditionalActionsMenuComponent } from './dot-legacy-additional-actions-menu.component';
import { MockMessageService } from '../../../../../test/message-service.mock';
import { MessageService } from '../../../../../api/services/messages-service';
import { By } from '@angular/platform-browser';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
    selector: 'p-menu',
    template: ''
})
class MockPrimeNGMenuComponent {
    @Input() model: MenuItem[];
    @Input() popup: boolean;
}

describe('DotLegacyAdditionalActionsMenuComponent', () => {

    let component: DotLegacyAdditionalActionsMenuComponent;
    let fixture: ComponentFixture<DotLegacyAdditionalActionsMenuComponent>;

    beforeEach(() => {

        const messageServiceMock = new MockMessageService({
            'template.action.additional.permissions': 'permissions',
            'template.action.additional.history': 'history',
            'template.action.additional.properties': 'properties'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                DotLegacyAdditionalActionsMenuComponent,
                MockPrimeNGMenuComponent
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotLegacyAdditionalActionsMenuComponent);
        component = fixture.componentInstance;
        component.templateId = '1';
    });

    it('should has a p-menu', () => {
        const pMenu = fixture.debugElement.query(By.css('p-menu'));

        expect(pMenu).toBeDefined();
        expect(component.items).toBe(pMenu.componentInstance.model);
    });

    it('should has a button', () => {
        const button = fixture.debugElement.query(By.css('button'));
        expect(button).toBeDefined();
    });

    it('should has a items attributes', () => {
        fixture.detectChanges();

        expect(component.items.length).toEqual(3);

        expect(component.items[0].label).toEqual('properties', 'the first item should be properties');
        expect(component.items[0].url).toEqual('/#/edit-page/template/1/properties', 'the first item should be properties url');

        expect(component.items[1].label).toEqual('permissions', 'the first item should be permissions');
        expect(component.items[1].url).toEqual('/#/edit-page/template/1/permissions', 'the first item should be permissions url');

        expect(component.items[2].label).toEqual('history', 'the first item should be history');
        expect(component.items[2].url).toEqual('/#/edit-page/template/1/history', 'the first item should be history url');
    });
});
