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
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Menu, MenuModule } from 'primeng/menu';
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
import { ButtonModel } from '@models/action-header';
import { DotTemplate } from '@models/dot-edit-layout-designer';

const templatesMock: DotTemplate[] = [
    {
        anonymous: false,
        friendlyName: 'Published template',
        identifier: '123Published',
        inode: '1AreSD',
        name: 'Published template',
        type: 'type',
        versionType: 'type',
        deleted: false,
        live: true,
        layout: null,
        canEdit: true,
        canWrite: true,
        canPublish: true
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
        locked: true,
        layout: null,
        canEdit: true,
        canWrite: true,
        canPublish: true
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
        live: false,
        layout: null,
        canEdit: true,
        canWrite: true,
        canPublish: true
    },
    {
        anonymous: false,
        friendlyName: 'Archived template',
        identifier: '123Archived',
        inode: '1AdsSD',
        name: 'Archived template',
        type: 'type',
        versionType: 'type',
        deleted: true,
        layout: null,
        canEdit: true,
        canWrite: true,
        canPublish: true
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
    let dotRouterService: DotRouterService;
    let rowActions: DebugElement[];
    let comp: DotTemplateListComponent;

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
        comp = fixture.componentInstance;
        dotTemplatesService = TestBed.inject(DotTemplatesService);
        dotMessageDisplayService = TestBed.inject(DotMessageDisplayService);
        dotPushPublishDialogService = TestBed.inject(DotPushPublishDialogService);
        dotRouterService = TestBed.inject(DotRouterService);
        fixture.detectChanges();
        tick(2);
        fixture.detectChanges();
        dotListingDataTable = fixture.debugElement.query(By.css('dot-listing-data-table'))
            .componentInstance;
        rowActions = fixture.debugElement.queryAll(By.css('dot-action-menu-button'));
    }));

    it('should set attributes of dotListingDataTable', () => {
        expect(dotListingDataTable.columns).toEqual(columnsMock);
        expect(dotListingDataTable.sortField).toEqual('modDate');
        expect(dotListingDataTable.sortOrder).toEqual('DESC');
        expect(dotListingDataTable.url).toEqual('v1/templates');
        expect(dotListingDataTable.actions).toEqual([]);
        expect(dotListingDataTable.checkbox).toEqual(true);
        expect(dotListingDataTable.dataKey).toEqual('inode');
        // expect(dotListingDataTable.firstPageData).toEqual(templatesMock);
    });

    it('should set Action Header options correctly', () => {
        const model: ButtonModel[] = dotListingDataTable.actionHeaderOptions.primary.model;
        expect(model[0].label).toEqual('Template Designer');
        expect(model[1].label).toEqual('Advanced Template');
        model[0].command();
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('/templates/new/designer');
        model[1].command();
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('/templates/new/advanced');
    });

    it('should set archive as extra param in pagination', () => {});

    describe('row actions', () => {
        it('should set actions to publish template', () => {
            const publishRow: DotActionMenuButtonComponent = rowActions[0].componentInstance;
            expect(publishRow.actions.length).toEqual(6);
            checkBasicOptions(publishRow);
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
            checkBasicOptions(unpublish);
            expect(unpublish.actions[4].menuItem.label).toEqual('Archive');
            expect(unpublish.actions[5].menuItem.label).toEqual('Copy');
        });
        it('should set actions to locked template', () => {
            const locked: DotActionMenuButtonComponent = rowActions[1].componentInstance;
            expect(locked.actions.length).toEqual(7);
            checkBasicOptions(locked);
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
            checkNotificationAndReLoadOfPage('Template archived');
        });
        it('should call unArchive api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unArchive').and.returnValue(of({}));
            archivedTemplate.actions[0].menuItem.command();

            expect(dotTemplatesService.unArchive).toHaveBeenCalledWith(['123Archived']);
            checkNotificationAndReLoadOfPage('Template unarchived');
        });
        it('should call publish api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'publish').and.returnValue(of({}));
            unPublishTemplate.actions[1].menuItem.command();

            expect(dotTemplatesService.publish).toHaveBeenCalledWith(['123Unpublish']);
            checkNotificationAndReLoadOfPage('Templates published');
        });
        it('should call unpublish api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unPublish').and.returnValue(of({}));
            publishTemplate.actions[4].menuItem.command();

            expect(dotTemplatesService.unPublish).toHaveBeenCalledWith(['123Published']);
            checkNotificationAndReLoadOfPage('Template unpublished');
        });
        it('should call unlock api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'unlock').and.returnValue(of({}));
            lockedTemplate.actions[5].menuItem.command();

            expect(dotTemplatesService.unlock).toHaveBeenCalledWith('123Locked');
            checkNotificationAndReLoadOfPage('Template unlocked');
        });
        it('should call copy api, send notification and reload current page', () => {
            spyOn(dotTemplatesService, 'copy').and.returnValue(of(templatesMock[0]));
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

    describe('bulk', () => {
        it('should set labels', () => {
            const menu: Menu = fixture.debugElement.query(
                By.css('.template-listing__header-options p-menu')
            ).componentInstance;
            expect(menu.model.length).toEqual(7);
            expect(menu.model[0].label).toEqual('Publish');
            expect(menu.model[1].label).toEqual('Push Publish');
            expect(menu.model[2].label).toEqual('Add To Bundle');
            expect(menu.model[3].label).toEqual('Unpublish');
            expect(menu.model[4].label).toEqual('Archive');
            expect(menu.model[5].label).toEqual('Unarchive');
            expect(menu.model[6].label).toEqual('Delete');
        });

        it('should execute actions', () => {
            comp.selectedTemplates = [templatesMock[0], templatesMock[1]];
            const menu: Menu = fixture.debugElement.query(
                By.css('.template-listing__header-options p-menu')
            ).componentInstance;

            spyOn(dotTemplatesService, 'publish').and.returnValue(of({}));
            spyOn(dotTemplatesService, 'unPublish').and.returnValue(of({}));
            spyOn(dotTemplatesService, 'archive').and.returnValue(of({}));
            spyOn(dotTemplatesService, 'unArchive').and.returnValue(of({}));
            spyOn(dotTemplatesService, 'delete').and.returnValue(of(true));
            spyOn(dotPushPublishDialogService, 'open');
            spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            menu.model[0].command();
            expect(dotTemplatesService.publish).toHaveBeenCalledWith(['123Published', '123Locked']);

            menu.model[1].command();
            expect(dotPushPublishDialogService.open).toHaveBeenCalledWith({
                assetIdentifier: '123Published,123Locked',
                title: 'Push Publish'
            });

            menu.model[2].command();
            expect(dotTemplatesService.publish).toHaveBeenCalledWith(['123Published', '123Locked']);

            menu.model[3].command();
            expect(dotTemplatesService.unPublish).toHaveBeenCalledWith([
                '123Published',
                '123Locked'
            ]);

            menu.model[4].command();
            fixture.detectChanges();
            const addToBundleDialog: DotAddToBundleComponent = fixture.debugElement.query(
                By.css('dot-add-to-bundle')
            ).componentInstance;
            expect(addToBundleDialog.assetIdentifier).toEqual('123Published,123Locked');

            menu.model[5].command();
            expect(dotTemplatesService.unArchive).toHaveBeenCalledWith([
                '123Published',
                '123Locked'
            ]);

            menu.model[6].command();
            expect(dotTemplatesService.delete).toHaveBeenCalledWith(['123Published', '123Locked']);
        });

        it('should display error if an action is wrong', () => {});

        it('should disable enable bulk action button based on selection', () => {
            const bulkActionsBtn: HTMLButtonElement = fixture.debugElement.query(
                By.css('.template-listing__header-options button')
            ).nativeElement;
            expect(bulkActionsBtn.disabled).toEqual(true);
            comp.selectedTemplates = templatesMock;
            fixture.detectChanges();
            expect(bulkActionsBtn.disabled).toEqual(false);
        });

        xit('should be disable if dont have publish rights ', () => {
            const bulkActionsBtn: HTMLButtonElement = fixture.debugElement.query(
                By.css('.template-listing__header-options button')
            ).nativeElement;
            comp.showCheckBox = false;
            fixture.detectChanges();
            expect(bulkActionsBtn.disabled).toEqual(true);
        });
    });

    it('', () => {});

    function checkBasicOptions(menu: DotActionMenuButtonComponent): void {
        expect(menu.actions[0].menuItem.label).toEqual('Edit');
        expect(menu.actions[1].menuItem.label).toEqual('Publish');
        expect(menu.actions[2].menuItem.label).toEqual('Push Publish');
        expect(menu.actions[3].menuItem.label).toEqual('Add To Bundle');
    }

    function checkNotificationAndReLoadOfPage(messsage: string): void {
        expect(dotMessageDisplayService.push).toHaveBeenCalledWith({
            ...mockMessageConfig,
            message: messsage
        });
        expect(dotListingDataTable.loadCurrentPage).toHaveBeenCalledTimes(1);
    }
});
