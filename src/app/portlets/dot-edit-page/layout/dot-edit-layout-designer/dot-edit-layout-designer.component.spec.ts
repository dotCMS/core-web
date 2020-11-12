import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditLayoutDesignerComponent } from './dot-edit-layout-designer.component';
import { DotEditLayoutGridModule } from '../components/dot-edit-layout-grid/dot-edit-layout-grid.module';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { DotActionButtonModule } from '@components/_common/dot-action-button/dot-action-button.module';
import { FormsModule, FormGroup } from '@angular/forms';
import { Component, Input, EventEmitter, Output, DebugElement } from '@angular/core';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { mockDotLayout, mockDotRenderedPage } from '@tests/dot-page-render.mock';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotEditPageInfoModule } from '../../components/dot-edit-page-info/dot-edit-page-info.module';
import { mockDotThemes } from '@tests/dot-themes.mock';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { DotThemesServiceMock } from '@tests/dot-themes-service.mock';
import { TooltipModule } from 'primeng/tooltip';
import * as _ from 'lodash';
import { DotTheme } from '@portlets/dot-edit-page/shared/models/dot-theme.model';
import { DotEditLayoutService } from '@portlets/dot-edit-page/shared/services/dot-edit-layout.service';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotGlobalMessageModule } from '@components/_common/dot-global-message/dot-global-message.module';
import { DotSecondaryToolbarModule } from '@components/dot-secondary-toolbar';

import cleanUpDialog from '@tests/clean-up-dialog';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotMessageService } from '@services/dot-message/dot-messages.service';

@Component({
    selector: 'dot-template-addtional-actions-menu',
    template: ''
})
class MockAdditionalOptionsComponent {
    @Input() inode: '';
}

@Component({
    selector: 'dot-layout-properties',
    template: ''
})
class MockDotLayoutPropertiesComponent {
    @Input() group: FormGroup;
}

@Component({
    selector: 'dot-layout-designer',
    template: ''
})
class MockDotLayoutDesignerComponent {
    @Input() group: FormGroup;
}

@Component({
    selector: 'dot-theme-selector',
    template: ''
})
class MockDotThemeSelectorComponent {
    @Input() value: DotTheme;
    @Output() selected = new EventEmitter<DotTheme>();
}

const messageServiceMock = new MockDotMessageService({
    'dot.common.cancel': 'Cancel',
    'editpage.layout.dialog.edit.page': 'Edit Page',
    'editpage.layout.dialog.edit.template': 'Edit Template',
    'editpage.layout.dialog.header': 'Edit some',
    'editpage.layout.dialog.info': 'This is the message',
    'editpage.layout.toolbar.action.save': 'Save',
    'editpage.layout.toolbar.save.template': 'Save as template',
    'editpage.layout.toolbar.template.name': 'Name of the template',
    'org.dotcms.frontend.content.submission.not.proper.permissions': 'No Read Permission'
});

let component: DotEditLayoutDesignerComponent;
let fixture: ComponentFixture<DotEditLayoutDesignerComponent>;
let dotRouterService: DotRouterService;
let dotThemesService: DotThemesService;

describe('DotEditLayoutDesignerComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DotEditLayoutDesignerComponent,
                MockAdditionalOptionsComponent,
                MockDotLayoutDesignerComponent,
                MockDotLayoutPropertiesComponent,
                MockDotThemeSelectorComponent
            ],
            imports: [
                DotActionButtonModule,
                DotEditLayoutGridModule,
                DotEditPageInfoModule,
                DotSecondaryToolbarModule,
                DotGlobalMessageModule,
                DotFieldValidationMessageModule,
                FormsModule,
                RouterTestingModule,
                TooltipModule,
                DotIconButtonModule
            ],
            providers: [
                DotEditLayoutService,
                DotThemesService,
                DotHttpErrorManagerService,
                DotRouterService,
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: DotThemesService, useClass: DotThemesServiceMock }
            ]
        });

        fixture = TestBed.createComponent(DotEditLayoutDesignerComponent);
        component = fixture.componentInstance;
        dotRouterService = TestBed.inject(DotRouterService);
        dotThemesService = TestBed.inject(DotThemesService);
    });

    describe('edit layout', () => {
        beforeEach(() => {
            component.layout = mockDotLayout();
            fixture.detectChanges();
        });
        // these need to be fixed when this is fixed correctly https://github.com/dotCMS/core/issues/18830
        it('should have dot-secondary-toolbar with right content', () => {
            const dotSecondaryToolbar = fixture.debugElement.query(By.css('dot-secondary-toolbar'));
            const dotEditPageInfo = fixture.debugElement.query(
                By.css('dot-secondary-toolbar .main-toolbar-left dot-edit-page-info')
            );
            const dotTemplateActions = fixture.debugElement.query(
                By.css('dot-secondary-toolbar .main-toolbar-right form')
            );
            const dotLayoutActions = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-themes')
            );

            expect(dotSecondaryToolbar).not.toBeNull();
            expect(dotEditPageInfo).not.toBeNull();
            expect(dotTemplateActions).not.toBeNull();
            expect(dotLayoutActions).not.toBeNull();
        });
        // these need to be fixed when this is fixed correctly https://github.com/dotCMS/core/issues/18830
        it('should show dot-edit-page-info', () => {
            const dotEditPageInfo: DebugElement = fixture.debugElement.query(
                By.css('dot-edit-page-info')
            );
            expect(dotEditPageInfo).toBeTruthy();
            // TODO: NEED EXTRA EXPECTS
        });

        it('should not show template name input', () => {
            const templateNameInput: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-template-name')
            );
            expect(templateNameInput).toBe(null);
        });

        it('should not show checkbox to save as template', () => {
            const checkboxSave: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-save-template')
            );
            expect(checkboxSave).toBe(null);
        });

        it('should show cancel button', () => {
            const cancelButton: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-cancel')
            );

            expect(cancelButton).toBeTruthy();
            expect(cancelButton.nativeElement.textContent).toEqual('Cancel');
        });

        it('should redirect to edit page on cancel button click', () => {
            const cancelButton: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-cancel')
            );
            cancelButton.triggerEventHandler('click', {});
            expect(dotRouterService.goToEditPage).toHaveBeenCalledWith({ url: '/an/url/test' });
        });

        it('should show save button', () => {
            fixture.detectChanges();
            const saveButton: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-save')
            );

            expect(saveButton).toBeTruthy();
            expect(saveButton.nativeElement.textContent).toEqual('Save');
        });

        it('should show dot-layout-properties and bind attr correctly', () => {
            fixture.detectChanges();
            const layoutProperties: DebugElement = fixture.debugElement.query(
                By.css('dot-layout-properties')
            );

            expect(layoutProperties).toBeTruthy();
            expect(layoutProperties.componentInstance.group).toEqual(component.form.get('layout'));
        });

        it('should have dot-layout-designer', () => {
            fixture.detectChanges();
            const layoutDesigner: DebugElement = fixture.debugElement.query(
                By.css('dot-layout-designer')
            );

            expect(layoutDesigner).toBeTruthy();
            expect(layoutDesigner.componentInstance.group).toEqual(component.form.get('layout'));
        });

        it('should not show dot-template-addtional-actions-menu', () => {
            const aditionalOptions: DebugElement = fixture.debugElement.query(
                By.css('dot-template-addtional-actions-menu')
            );

            expect(aditionalOptions).toBe(null);
        });

        it('should not show save as template checkbox', () => {
            const saveAsTemplate: DebugElement = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-save-template')
            );

            expect(saveAsTemplate).toBe(null);
        });

        it('should set form model correctly', () => {
            expect(component.form.value).toEqual({
                title: null,
                themeId: '123',
                layout: {
                    body: mockDotRenderedPage().layout.body,
                    header: mockDotRenderedPage().layout.header,
                    footer: mockDotRenderedPage().layout.footer,
                    sidebar: {
                        location: mockDotRenderedPage().layout.sidebar.location,
                        containers: mockDotRenderedPage().layout.sidebar.containers,
                        width: mockDotRenderedPage().layout.sidebar.width
                    }
                }
            });
        });
    });

    describe('themes', () => {
        let themeSelector: MockDotThemeSelectorComponent;
        let themeButton;

        beforeEach(() => {
            component.layout = mockDotLayout();
            component.themeDialogVisibility = true;
        });

        it('should expose theme selector component & Theme button be enabled', () => {
            fixture.detectChanges();
            themeButton = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-themes')
            ).nativeElement;
            themeButton.click();
            themeSelector = fixture.debugElement.query(By.css('dot-theme-selector'))
                .componentInstance;
            const themeSelectorBtn = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-themes')
            ).nativeElement;
            expect(themeSelector).not.toBe(null);
            expect(themeSelectorBtn.disabled).toBe(false);
        });

        it('should Theme button be disabled', () => {
            spyOn(dotThemesService, 'get').and.returnValue(observableOf(null));
            fixture.detectChanges();
            const themeSelectorBtn = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-themes')
            ).nativeElement;
            const themeSelectorBtnContainer = fixture.debugElement.query(
                By.css('.dot-edit__layout-actions-themes')
            ).nativeElement;
            expect(themeSelectorBtn.disabled).toBe(true);
            expect(themeSelectorBtnContainer.outerHTML).toContain('No Read Permission');
        });

        it('should get the emitted value from themes and trigger a save', () => {
            spyOn(component, 'changeThemeHandler').and.callThrough();
            fixture.detectChanges();
            themeButton = fixture.debugElement.query(
                By.css('.dot-edit-layout__toolbar-action-themes')
            ).nativeElement;
            themeButton.click();
            themeSelector = fixture.debugElement.query(By.css('dot-theme-selector'))
                .componentInstance;
            const mockTheme = _.cloneDeep(mockDotThemes[0]);
            themeSelector.selected.emit(mockTheme);
            expect(component.changeThemeHandler).toHaveBeenCalledWith(mockTheme);
        });
    });

    describe('containers model', () => {
        beforeEach(() => {
            component.layout = mockDotLayout();
        });

        it('should have a sidebar containers', () => {
            fixture.detectChanges();
            expect(component.form.value.layout.sidebar.containers).toEqual([
                {
                    identifier: 'fc193c82-8c32-4abe-ba8a-49522328c93e',
                    uuid: 'LEGACY_RELATION_TYPE'
                }
            ]);
        });

        it('should have a null sidebar containers', () => {
            const layout = mockDotLayout();

            component.layout = {
                ...layout,
                sidebar: {
                    ...layout.sidebar,
                    containers: []
                }
            };
            fixture.detectChanges();
            expect(component.form.value.layout.sidebar.containers).toEqual([]);
        });
    });

    describe('save button', () => {
        let saveButton: DebugElement;

        beforeEach(() => {
            component.layout = mockDotLayout();

            fixture.detectChanges();
            saveButton = fixture.debugElement.query(By.css('.dot-edit-layout__toolbar-save'));
        });

        it('should have disabled by default', () => {
            expect(saveButton.nativeElement.disabled).toBe(true);
        });

        it('should have enabled if the model is updated', () => {
            component.form.get('layout.header').setValue(true);
            fixture.detectChanges();

            expect(saveButton.nativeElement.disabled).toBe(false);
        });

        it('should have disabled if the form is not valid', () => {
            // This will make the template title required, it's like clicking the "Save as template" checkbox
            // component.saveAsTemplateHandleChange(true);
            fixture.detectChanges();

            expect(saveButton.nativeElement.disabled).toBe(true);
        });
    });

    describe('edit layout No sidebars', () => {
        beforeEach(() => {
            const layout = mockDotLayout();

            component.layout = {
                ...layout,
                sidebar: null
            };
            fixture.detectChanges();
        });

        it('should not break when sidebar property in layout is null', () => {
            expect(component.form.value).toEqual({
                title: null,
                themeId: '123',
                layout: {
                    body: mockDotRenderedPage().layout.body,
                    header: mockDotRenderedPage().layout.header,
                    footer: mockDotRenderedPage().layout.footer,
                    sidebar: {
                        location: '',
                        containers: [],
                        width: 'small'
                    }
                }
            });
        });
    });

    afterEach(() => {
        cleanUpDialog(fixture);
    });
});
