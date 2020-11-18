import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DotTemplateListComponent } from './dot-template-list.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { By } from '@angular/platform-browser';
import {
    CoreWebService,
    DotcmsConfigService,
    DotcmsEventsService,
    DotEventsSocket,
    DotEventsSocketURL,
    DotPushPublishDialogService,
    LoggerService,
    LoginService,
    StringUtils
} from 'dotcms-js';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { dotEventSocketURLFactory } from '@tests/dot-test-bed';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { MockDotRouterService } from '@tests/dot-router-service.mock';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DotActionButtonModule } from '@components/_common/dot-action-button/dot-action-button.module';
import { DotActionMenuButtonModule } from '@components/_common/dot-action-menu-button/dot-action-menu-button.module';
import { DotAddToBundleModule } from '@components/_common/dot-add-to-bundle';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DotListingDataTableComponent } from '@components/dot-listing-data-table/dot-listing-data-table.component';
import { DebugElement } from '@angular/core';
import { DotActionMenuButtonComponent } from '@components/_common/dot-action-menu-button/dot-action-menu-button.component';
import { DotMessageSeverity, DotMessageType } from '@components/dot-message-display/model';
import { DotAddToBundleComponent } from '@components/_common/dot-add-to-bundle/dot-add-to-bundle.component';

const templatesMock = [
    {
        anonymous: false,
        friendlyName: 'Published template',
        identifier: '123Published',
        inode: '1AreSD',
        name: 'Published template',
        type: 'type',
        versionType: 'type',
        deleted: false,
        live: true
    },
    {
        anonymous: false,
        friendlyName: 'Locked template',
        identifier: '123Locked',
        inode: '1sASD',
        name: 'Locked template',
        type: 'type',
        versionType: 'type',
        deleted: false,
        live: true,
        locked: true
    },
    {
        anonymous: false,
        friendlyName: 'Unpublish template',
        identifier: '123Unpublish',
        inode: '1ASgD',
        name: 'Unpublish template',
        type: 'type',
        versionType: 'type',
        deleted: false,
        live: false
    },
    {
        anonymous: false,
        friendlyName: 'Archived template',
        identifier: '123Archived',
        inode: '1AdsSD',
        name: 'Archived template',
        type: 'type',
        versionType: 'type',
        deleted: true
    }
];

const routeDataMock = {
    dotTemplateListResolverData: [templatesMock, true, true]
};
class ActivatedRouteMock {
    get data() {
        return of(routeDataMock);
    }
}

const messages = {
    'templates.fieldName.name': 'Name',
    'templates.fieldName.status': 'Status',
    'templates.fieldName.description': 'Description',
    'templates.fieldName.lastEdit': 'Last Edit',
    'design-template': 'Template Designer',
    'code-template': 'Advanced Template',
    Publish: 'Publish',
    'Remote-Publish': 'Push Publish',
    'Add-To-Bundle': 'Add To Bundle',
    Unpublish: 'Unpublish',
    Archive: 'Archive',
    Unarchive: 'Unarchive',
    Delete: 'Delete',
    Copy: 'Copy',
    'message.template.copy': 'Template copied',
    unlock: 'Unlock',
    'message.template.unlocked': 'Template unlocked',
    'message.template.delete': 'Template archived',
    'contenttypes.content.push_publish': 'Push Publish',
    edit: 'Edit',
    publish: 'Publish',
    'message.template.confirm.delete.template':
        'Are you sure you want to delete this Template?  (This operation cannot be undone)',
    'message.template.full_delete': 'Template deleted',
    'message.template_list.published': 'Templates published',
    'message.template.unpublished': 'Template unpublished',
    'message.template.undelete': 'Template unarchived'
};

const columnsMock = [
    {
        fieldName: 'name',
        header: 'Name',
        sortable: true
    },
    {
        fieldName: 'status',
        header: 'Status'
    },
    {
        fieldName: 'friendlyName',
        header: 'Description'
    },
    {
        fieldName: 'modDate',
        format: 'date',
        header: 'Last Edit',
        sortable: true
    }
];

const mockMessageConfig = {
    life: 3000,
    severity: DotMessageSeverity.SUCCESS,
    type: DotMessageType.SIMPLE_MESSAGE
};

fdescribe('DotTemplateListComponent', () => {
    let fixture: ComponentFixture<DotTemplateListComponent>;
    let dotListingDataTable: DotListingDataTableComponent;
    let dotTemplatesService: DotTemplatesService;
    let dotMessageDisplayService: DotMessageDisplayService;
    let dotPushPublishDialogService: DotPushPublishDialogService;
    let rowActions: DebugElement[];

    const messageServiceMock = new MockDotMessageService(messages);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplateListComponent],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                {
                    provide: ActivatedRoute,
                    useClass: ActivatedRouteMock
                },
                LoggerService,
                StringUtils,
                DotTemplatesService,
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotHttpErrorManagerService,
                DotAlertConfirmService,
                ConfirmationService,
                LoginService,
                DotcmsEventsService,
                DotEventsSocket,
                { provide: DotEventsSocketURL, useFactory: dotEventSocketURLFactory },
                DotcmsConfigService,
                DotMessageDisplayService,
                {
                    provide: DotRouterService,
                    useValue: {
                        gotoPortlet: jasmine.createSpy(),
                        goToEditTemplate: jasmine.createSpy()
                    }
                }
            ],
            imports: [
                DotListingDataTableModule,
                CommonModule,
                DotPipesModule,
                SharedModule,
                CheckboxModule,
                MenuModule,
                ButtonModule,
                DotActionButtonModule,
                DotActionMenuButtonModule,
                DotAddToBundleModule,
                HttpClientTestingModule
            ]
        }).compileComponents();
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(DotTemplateListComponent);
        dotTemplatesService = TestBed.inject(DotTemplatesService);
        dotMessageDisplayService = TestBed.inject(DotMessageDisplayService);
        dotPushPublishDialogService = TestBed.inject(DotPushPublishDialogService);
        fixture.detectChanges();
        tick(2);
        fixture.detectChanges();
        dotListingDataTable = fixture.debugElement.query(By.css('dot-listing-data-table'))
            .componentInstance;
        rowActions = fixture.debugElement.queryAll(By.css('dot-action-menu-button'));
    }));

    it('should set attributes of dotListingDataTable', () => {
        // TODO set options correctly.
        // expect(dotListingDataTable.actionHeaderOptions).toEqual(null);
        expect(dotListingDataTable.columns).toEqual(columnsMock);
        expect(dotListingDataTable.sortField).toEqual('modDate');
        expect(dotListingDataTable.sortOrder).toEqual('DESC');
        expect(dotListingDataTable.url).toEqual('v1/templates');
        expect(dotListingDataTable.actions).toEqual([]);
        expect(dotListingDataTable.checkbox).toEqual(true);
        expect(dotListingDataTable.dataKey).toEqual('inode');
        // expect(dotListingDataTable.firstPageData).toEqual(templatesMock);
    });

    it('should set archive as extra param in pagination', () => {});

    describe('row actions', () => {
        it('should set actions to publish template', () => {
            const publishRow: DotActionMenuButtonComponent = rowActions[0].componentInstance;
            expect(publishRow.actions.length).toEqual(6);
            expect(publishRow.actions[0].menuItem.label).toEqual('Edit');
            expect(publishRow.actions[1].menuItem.label).toEqual('Publish');
            expect(publishRow.actions[2].menuItem.label).toEqual('Push Publish');
            expect(publishRow.actions[3].menuItem.label).toEqual('Add To Bundle');
            expect(publishRow.actions[4].menuItem.label).toEqual('Unpublish');
            expect(publishRow.actions[5].menuItem.label).toEqual('Copy');
        });

        it('should set actions to archived template', () => {
            const archived: DotActionMenuButtonComponent = rowActions[3].componentInstance;
            expect(archived.actions.length).toEqual(2);
            expect(archived.actions[0].menuItem.label).toEqual('Unarchive');
            expect(archived.actions[1].menuItem.label).toEqual('Delete');
        });

        it('should set actions to unPublish template', () => {
            const unpublish: DotActionMenuButtonComponent = rowActions[2].componentInstance;
            expect(unpublish.actions.length).toEqual(6);
            expect(unpublish.actions[0].menuItem.label).toEqual('Edit');
            expect(unpublish.actions[1].menuItem.label).toEqual('Publish');
            expect(unpublish.actions[2].menuItem.label).toEqual('Push Publish');
            expect(unpublish.actions[3].menuItem.label).toEqual('Add To Bundle');
            expect(unpublish.actions[4].menuItem.label).toEqual('Archive');
            expect(unpublish.actions[5].menuItem.label).toEqual('Copy');
        });
        it('should set actions to locked template', () => {
            const locked: DotActionMenuButtonComponent = rowActions[1].componentInstance;
            expect(locked.actions.length).toEqual(7);
            expect(locked.actions[0].menuItem.label).toEqual('Edit');
            expect(locked.actions[1].menuItem.label).toEqual('Publish');
            expect(locked.actions[2].menuItem.label).toEqual('Push Publish');
            expect(locked.actions[3].menuItem.label).toEqual('Add To Bundle');
            expect(locked.actions[4].menuItem.label).toEqual('Unpublish');
            expect(locked.actions[5].menuItem.label).toEqual('Unlock');
            expect(locked.actions[6].menuItem.label).toEqual('Copy');
        });

        it('should hide push-publish and Add to Bundle actions', () => {});
    });

    describe('actions command', () => {
        let unPublishTemplate: DotActionMenuButtonComponent;
        let publishTemplate: DotActionMenuButtonComponent;
        let lockedTemplate: DotActionMenuButtonComponent;
        let archivedTemplate: DotActionMenuButtonComponent;

        beforeEach(() => {
            spyOn(dotMessageDisplayService, 'push');
            spyOn(dotListingDataTable, 'loadCurrentPage');
            publishTemplate = rowActions[0].componentInstance;
            lockedTemplate = rowActions[1].componentInstance;
            unPublishTemplate = rowActions[2].componentInstance;
            archivedTemplate = rowActions[3].componentInstance;
        });

        it('should go to edit template', () => {});
        it('should open add to bundle dialog', () => {
            publishTemplate.actions[3].menuItem.command();
            fixture.detectChanges();
            const addToBundleDialog: DotAddToBundleComponent = fixture.debugElement.query(
                By.css('dot-add-to-bundle')
            ).componentInstance;
            expect(addToBundleDialog.assetIdentifier).toEqual('123Published');
        });

        it('should open Push Publish dialog', () => {
            spyOn(dotPushPublishDialogService, 'open');
            publishTemplate.actions[2].menuItem.command();
            expect(dotPushPublishDialogService.open).toHaveBeenCalledWith({
                assetIdentifier: '123Published',
                title: 'Push Publish'
            });
        });
        it('should call archive endpoint, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'archive').and.returnValue(of({}));
            unPublishTemplate.actions[4].menuItem.command();

            expect(dotTemplatesService.archive).toHaveBeenCalledWith(['123Unpublish']);
            expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
                ...mockMessageConfig,
                message: 'Template archived'
            });
            expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
        });
        it('should call unArchive api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unArchive').and.returnValue(of({}));
            archivedTemplate.actions[0].menuItem.command();

            expect(dotTemplatesService.unArchive).toHaveBeenCalledWith(['123Archived']);
            expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
                ...mockMessageConfig,
                message: 'Template unarchived'
            });
            expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
        });
        it('should call publish api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'publish').and.returnValue(of({}));
            unPublishTemplate.actions[1].menuItem.command();

            expect(dotTemplatesService.publish).toHaveBeenCalledWith(['123Unpublish']);
            expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
                ...mockMessageConfig,
                message: 'Templates published'
            });
            expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
        });
        it('should call unpublish api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unPublish').and.returnValue(of({}));
            publishTemplate.actions[4].menuItem.command();

            expect(dotTemplatesService.unPublish).toHaveBeenCalledWith(['123Published']);
            expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
                ...mockMessageConfig,
                message: 'Template unpublished'
            });
            expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
        });
        it('should call unlock api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unlock').and.returnValue(of({}));
            lockedTemplate.actions[5].menuItem.command();

            expect(dotTemplatesService.unlock).toHaveBeenCalledWith('123Locked');
            expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
                ...mockMessageConfig,
                message: 'Template unlocked'
            });
            expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
        });
        it('should call copy api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'copy').and.returnValue(of({}));
            publishTemplate.actions[5].menuItem.command();

            expect(dotTemplatesService.copy).toHaveBeenCalledWith('123Published');
            checkNotificationAndReLoadOfPage('Template copied');
        });
        it('should call delete api, send notification and reload current page', () => {
            spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            spyOn(dotTemplatesService, 'delete').and.returnValue(of(true));
            archivedTemplate.actions[1].menuItem.command();

            expect(dotTemplatesService.delete).toHaveBeenCalledWith(['123Archived']);
            checkNotificationAndReLoadOfPage('Template deleted');
        });
    });

    describe('bulk actions', () => {
        it('should pass bulk actions', () => {});

        it('should disable actions buttons with no selection', () => {});
        it('should enable actions buttons with selections', () => {});

        it('should display error in an action is wrong', () => {});
        it('should hide push-publish and Add to Bundle actions', () => {});
    });

    it('', () => {});

    function checkNotificationAndReLoadOfPage(messsage: string): void {
        expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
            ...mockMessageConfig,
            message: messsage
        });
        expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
    }
});
