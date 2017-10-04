import { DOTTestBed } from '../../../test/dot-test-bed';
import { ContentTypesLayoutComponent } from './content-types-layout.component';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, Component, Input, SimpleChange } from '@angular/core';
import { TabViewModule } from 'primeng/primeng';
import { MockMessageService } from '../../../test/message-service.mock';
import { MessageService } from '../../../api/services/messages-service';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'content-types-fields-list',
    template: ''
})
class TestContentTypeFieldsList {

}

@Component({
    selector: 'content-type-fields-row-list',
    template: ''
})
class TestContentTypeFieldsRowList {

}

@Component({
    selector: 'dot-iframe',
    template: ''
})
class TestDotIframe {
    @Input() src: string;
}

@Component({
    selector: 'dot-content-types-relationship-listing',
    template: ''
})
class TestContentTypesRelationshipListingComponent {

}

describe('ContentTypesLayoutComponent', () => {
    let comp: ContentTypesLayoutComponent;
    let fixture: ComponentFixture<ContentTypesLayoutComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {

        const messageServiceMock = new MockMessageService({
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
                TestContentTypeFieldsList,
                TestContentTypeFieldsRowList,
                TestDotIframe,
                TestContentTypesRelationshipListingComponent
            ],
            imports: [
                TabViewModule
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypesLayoutComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
    });

    it('should has a tab-view', () => {
        const contentType = fixture.debugElement.query(By.css('.content-type'));
        const pTabView = contentType.query(By.css('p-tabView'));

        expect(pTabView).not.toBeNull();
    });

    it('should has just one tab', () => {
        fixture.detectChanges();

        const contentType = fixture.debugElement.query(By.css('.content-type'));
        const pTabPanels = contentType.queryAll(By.css('p-tabPanel'));
        expect(1).toBe(pTabPanels.length);
    });

    describe('Fields Tab', () => {
        beforeEach(() => {
            const contentType = fixture.debugElement.query(By.css('.content-type'));
            this.pTabPanel = contentType.queryAll(By.css('p-tabPanel'))[0];
        });

        it('should has a field panel', () => {
            fixture.detectChanges();
            expect(this.pTabPanel).not.toBeNull();
            expect('Fields Header Tab').toBe(this.pTabPanel.componentInstance.header);
        });

        it('should has a content-type__fields-main', () => {
            fixture.detectChanges();

            const contentTypeFieldsMain = this.pTabPanel.query(By.css('.content-type__fields-main'));
            expect(contentTypeFieldsMain).not.toBeNull();
        });

        it('should has a content-type__fields-sidebar', () => {
            fixture.detectChanges();

            const contentTypeFieldsSideBar = this.pTabPanel.query(By.css('.content-type__fields-sidebar'));
            expect(contentTypeFieldsSideBar).not.toBeNull();
        });

        it('should has a field types list', () => {
            fixture.detectChanges();

            const contentTypeFieldsSideBar = this.pTabPanel.query(By.css('.content-type__fields-sidebar'));
            const fieldTitle = this.pTabPanel.query(By.css('.content-type__fields-sidebar-title'));
            const contentTypesFieldsList = this.pTabPanel.query(By.css('content-types-fields-list'));

            expect('Field Title').toBe(fieldTitle.nativeElement.textContent);
            expect(contentTypesFieldsList).not.toBeNull();
        });

        it('should has a field row list', () => {
            fixture.detectChanges();

            const contentTypeFieldsSideBar = this.pTabPanel.query(By.css('.content-type__fields-sidebar'));
            const layoutTitle = this.pTabPanel.queryAll(By.css('.content-type__fields-sidebar-title'))[1];
            const fieldRowList = this.pTabPanel.query(By.css('content-type-fields-row-list'));

            expect('Layout Title').toBe(layoutTitle.nativeElement.textContent);
            expect(fieldRowList).not.toBeNull();
        });
    });

    describe('Permission tab', () => {
        beforeEach(() => {
            this.contentType = fixture.debugElement.query(By.css('.content-type'));
        });

        it('should has a permission panel', () => {
            comp.contentTypeId = '1';

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[2];

            expect(pTabPanel).not.toBeNull();
            expect('Permissions Tab').toBe(pTabPanel.componentInstance.header);
        });

        it('should has a iframe', () => {
            comp.contentTypeId = '1';

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[2];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            expect(iframe).not.toBeNull();
        });

        it('should set the src attribute', () => {
            comp.contentTypeId = '1';

            comp.ngOnChanges({
                contentTypeId: new SimpleChange(null, '2', true),
            });

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[2];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            expect('/html/content_types/permissions.jsp?contentTypeId=2&popup=true').toBe(iframe.componentInstance.src);
        });
    });

    describe('Push History tab', () => {
        beforeEach(() => {
            this.contentType = fixture.debugElement.query(By.css('.content-type'));
        });

        it('should has a permission panel', () => {
            comp.contentTypeId = '1';

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[3];

            expect(pTabPanel).not.toBeNull();
            expect('Push History').toBe(pTabPanel.componentInstance.header);
        });

        it('should has a iframe', () => {
            comp.contentTypeId = '1';

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[3];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            expect(iframe).not.toBeNull();
        });

        it('should set the src attribute', () => {
            comp.contentTypeId = '1';

            comp.ngOnChanges({
                contentTypeId: new SimpleChange(null, '2', true),
            });

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[3];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            expect('/html/content_types/push_history.jsp?contentTypeId=2&popup=true').toBe(iframe.componentInstance.src);
        });
    });

    describe('Relationship tab', () => {
        beforeEach(() => {
            this.contentType = fixture.debugElement.query(By.css('.content-type'));
            comp.contentTypeId = '1';

            fixture.detectChanges();

            this.relationshipTab = this.contentType.queryAll(By.css('p-tabPanel'))[1];
        });

        it('should has a Relationship tab', () => {
            expect(this.relationshipTab).toBeDefined();
        });

        it('should has a right header', () => {
            expect('Relationship').toBe(this.relationshipTab.componentInstance.header);
        });

        it('should has a iframe', () => {
            comp.contentTypeId = '1';

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[1];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            expect(iframe).not.toBeNull();
        });

        it('should set the src attribute', () => {
            comp.contentTypeId = '1';

            comp.ngOnChanges({
                contentTypeId: new SimpleChange(null, '1', true),
            });

            fixture.detectChanges();
            const pTabPanel = this.contentType.queryAll(By.css('p-tabPanel'))[1];
            const iframe = pTabPanel.query(By.css('dot-iframe'));

            // tslint:disable-next-line:max-line-length
            expect('c/portal/layout?p_l_id=56fedb43-dbbf-4ce2-8b77-41fb73bad015&p_p_id=content-types&_content_types_struts_action=%2Fext%2Fstructure%2Fview_relationships&_content_types_structure_id=1')
                .toBe(iframe.componentInstance.src);
        });
    });
});
