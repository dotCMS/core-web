import { DotRenderedPage } from './../../shared/models/dot-rendered-page.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotEditLayoutAdvancedModule } from '../dot-edit-layout-advanced/dot-edit-layout-advanced.module';
import { DotEditLayoutComponent } from './dot-edit-layout.component';
import { DotEditLayoutDesignerModule } from '../dot-edit-layout-designer/dot-edit-layout-designer.module';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { mockDotRenderedPage } from '../../../../test/dot-rendered-page.mock';
import { mockDotPageState } from '../../content/dot-edit-content.component.spec';

const getTestingModule = (dotRenderedPage?: DotRenderedPage) => {
    return {
        declarations: [DotEditLayoutComponent],
        imports: [
            BrowserAnimationsModule,
            DotEditLayoutAdvancedModule,
            DotEditLayoutDesignerModule,
            RouterTestingModule
        ],
        providers: [
            {
                provide: LoginService,
                useClass: LoginServiceMock
            },
            {
                provide: ActivatedRoute,
                useValue: {
                    parent: {
                        parent: {
                            data: Observable.of({
                                content: {
                                    ...dotRenderedPage || mockDotRenderedPage,
                                    state: mockDotPageState
                                }
                            })
                        }
                    }
                }
            }
        ]
    };
};

let fixture: ComponentFixture<DotEditLayoutComponent>;

describe('DotEditLayoutComponent with Layout Designer', () => {
    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule(getTestingModule());
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditLayoutComponent);
        fixture.detectChanges();
    });

    it('should have dot-edit-layout-designer', () => {
        const layoutDesigner: DebugElement = fixture.debugElement.query(By.css('dot-edit-layout-designer'));
        expect(layoutDesigner).toBeTruthy();
    });

    it('should pass pageView to the dot-edit-layout-designer', () => {
        const layoutDesigner: DebugElement = fixture.debugElement.query(By.css('dot-edit-layout-designer'));
        expect(layoutDesigner.componentInstance.pageState).toEqual({
            ...mockDotRenderedPage,
            state: mockDotPageState
        });
    });
});

const advancedTemplateMockDotRenderedPage: DotRenderedPage = {
    ...mockDotRenderedPage,
    template: {
        ...mockDotRenderedPage.template,
        drawed: false
    }
};

describe('DotEditLayoutComponent with Edit Advanced Layout', () => {
    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule(getTestingModule(advancedTemplateMockDotRenderedPage));
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditLayoutComponent);
        fixture.detectChanges();
    });

    it('should have dot-edit-layout-advanced', () => {
        const layoutDesigner: DebugElement = fixture.debugElement.query(By.css('dot-edit-layout-advanced'));
        expect(layoutDesigner).toBeTruthy();
    });

    it('should pass templateInode to the dot-edit-layout-advanced', () => {
        const layoutEditorAdvanced: DebugElement = fixture.debugElement.query(By.css('dot-edit-layout-advanced'));
        expect(layoutEditorAdvanced.componentInstance.templateInode).toEqual('123');
    });
});
