import { DOTTestBed } from '../../../test/dot-test-bed';
import { ContentTypesLayoutComponent } from './content-types-layout.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, Component, Input, Injectable } from '@angular/core';
import { TabViewModule } from 'primeng/primeng';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { By } from '@angular/platform-browser';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { Observable } from 'rxjs/Observable';
import { FieldDragDropService } from '../fields/service';

@Component({
    selector: 'dot-content-types-fields-list',
    template: ''
})
class TestContentTypeFieldsListComponent {}

@Component({
    selector: 'dot-content-type-fields-row-list',
    template: ''
})
class TestContentTypeFieldsRowListComponent {}

@Component({
    selector: 'dot-iframe',
    template: ''
})
class TestDotIframeComponent {
    @Input() src: string;
}

@Component({
    selector: 'dot-test-host-component',
    template: '<dot-content-type-layout [contentTypeId]="contentTypeId"></dot-content-type-layout>'
})
class TestHostComponent {
    @Input() contentTypeId: string;
}

@Component({
    selector: 'dot-content-types-relationship-listing',
    template: ''
})
class TestContentTypesRelationshipListingComponent {}

@Injectable()
export class MockDotMenuService {
    getDotMenuId(): Observable<string> {
        return Observable.of('1234');
    }
}

class FieldDragDropServiceMock {
    setBagOptions() {}
}

describe('ContentTypesLayoutComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;


    beforeEach(() => {
        const messageServiceMock = new MockDotMessageService({
            'contenttypes.sidebar.components.title': 'Field Title',
            'contenttypes.tab.fields.header': 'Fields Header Tab',
            'contenttypes.sidebar.layouts.title': 'Layout Title',
            'contenttypes.tab.permissions.header': 'Permissions Tab',
            'contenttypes.tab.publisher.push.history.header': 'Push History',
            'contenttypes.tab.relationship.header': 'Relationship'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypesLayoutComponent,
                TestContentTypeFieldsListComponent,
                TestContentTypeFieldsRowListComponent,
                TestDotIframeComponent,
                TestContentTypesRelationshipListingComponent,
                TestHostComponent
            ],
            imports: [TabViewModule],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: DotMenuService, useClass: MockDotMenuService },
                { provide: FieldDragDropService, useClass: FieldDragDropServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(TestHostComponent);
        de = fixture.debugElement.query(By.css('dot-content-type-layout'));
    });

    it('should has a tab-view', () => {
        const contentType = fixture.debugElement.query(By.css('.content-type'));
        const pTabView = contentType.query(By.css('p-tabView'));

        expect(pTabView).not.toBeNull();
    });

    it('should has just one tab', () => {
        const pTabPanels = fixture.debugElement.queryAll(By.css('p-tabPanel'));
        expect(pTabPanels.length).toBe(1);
    });

    it('should set the field and row bag options', () => {
        const fieldDragDropService: FieldDragDropService = fixture.debugElement.injector.get(FieldDragDropService);
        spyOn(fieldDragDropService, 'setBagOptions');
        fixture.detectChanges();

        expect(fieldDragDropService.setBagOptions).toHaveBeenCalledTimes(1);
    });

    describe('Fields Tab', () => {
        beforeEach(() => {
            fixture.detectChanges();

            this.pTabPanel = fixture.debugElement.query(By.css('p-tabView .content-type__properties'));
        });

        it('should has a field panel', () => {
            expect(this.pTabPanel).not.toBeNull();
            expect(this.pTabPanel.componentInstance.header).toBe('Fields Header Tab');
        });

        it('should has a content-type__fields-main', () => {
            const contentTypeFieldsMain = this.pTabPanel.query(By.css('.content-type__fields-main'));
            expect(contentTypeFieldsMain).not.toBeNull();
        });

        it('should has a content-type__fields-sidebar', () => {
            const contentTypeFieldsSideBar = this.pTabPanel.query(By.css('.content-type__fields-sidebar'));
            expect(contentTypeFieldsSideBar).not.toBeNull();
        });

        it('should has a field types list', () => {
            const fieldTitle = this.pTabPanel.query(By.css('.content-type__fields-sidebar-title'));
            const contentTypesFieldsList = this.pTabPanel.query(By.css('dot-content-types-fields-list'));

            expect(fieldTitle.nativeElement.textContent).toBe('Field Title');
            expect(contentTypesFieldsList).not.toBeNull();
        });

        it('should has a field row list', () => {
            const layoutTitle = this.pTabPanel.queryAll(By.css('.content-type__fields-sidebar-title'))[1];
            const fieldRowList = this.pTabPanel.query(By.css('dot-content-type-fields-row-list'));

            expect(layoutTitle.nativeElement.textContent).toBe('Layout Title');
            expect(fieldRowList).not.toBeNull();
        });
    });

    fdescribe('Permission tab', () => {
        beforeEach(() => {
            fixture.componentInstance.contentTypeId = '2';
            fixture.detectChanges();

            this.pTabPanel = fixture.debugElement.query(By.css('.content-type__permissions'));
        });

        it('should has a permission panel', () => {
            expect(this.pTabPanel).not.toBeNull();
            expect(this.pTabPanel.componentInstance.header).toBe('Permissions Tab');
        });

        it('should has a iframe', () => {
            const iframe = this.pTabPanel.query(By.css('dot-iframe'));
            expect(iframe).not.toBeNull();
        });

        fit('should set the src attribute', () => {
            const iframe = this.pTabPanel.query(By.css('dot-iframe'));
            expect(iframe.componentInstance.src).toBe('/html/content_types/permissions.jsp?contentTypeId=2&popup=true');
        });
    });

    describe('Push History tab', () => {
        beforeEach(() => {
            fixture.componentInstance.contentTypeId = '2';
            fixture.detectChanges();
            this.pTabPanel = fixture.debugElement.query(By.css('p-tabView .content-type__push_history'));
        });

        it('should has a permission panel', () => {
            expect(this.pTabPanel).not.toBeNull();
            expect(this.pTabPanel.componentInstance.header).toBe('Push History');
        });

        it('should has a iframe', () => {
            const iframe = this.pTabPanel.query(By.css('dot-iframe'));
            expect(iframe).not.toBeNull();
        });

        it('should set the src attribute', () => {
            const iframe = this.pTabPanel.query(By.css('dot-iframe'));

            expect(iframe.componentInstance.src).toBe('/html/content_types/push_history.jsp?contentTypeId=2&popup=true');
        });
    });

    describe('Relationship tab', () => {
        beforeEach(() => {
            this.contentType = de.query(By.css('.content-type'));
            fixture.componentInstance.contentTypeId = '2';

            fixture.detectChanges();

            this.relationshipTab = this.contentType.query(By.css('p-tabView .content-type__relationships'));
        });

        it('should has a Relationship tab', () => {
            expect(this.relationshipTab).toBeDefined();
        });

        it('should has a right header', () => {
            expect(this.relationshipTab.componentInstance.header).toBe('Relationship');
        });

        it('should has a iframe', () => {
            const iframe = this.relationshipTab.query(By.css('dot-iframe'));

            expect(iframe).not.toBeNull();
        });

        it('should set the src attribute', () => {
            const iframe = this.relationshipTab.query(By.css('dot-iframe'));

            // tslint:disable-next-line:max-line-length
            expect(iframe.componentInstance.src).toBe(
                // tslint:disable-next-line:max-line-length
                'c/portal/layout?p_l_id=1234&p_p_id=content-types&_content_types_struts_action=%2Fext%2Fstructure%2Fview_relationships&_content_types_structure_id=2'
            );
        });
    });
});
