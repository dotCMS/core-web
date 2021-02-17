import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DotCopyButtonModule } from '@components/dot-copy-button/dot-copy-button.module';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { dotcmsContentTypeBasicMock } from '@tests/dot-content-types.mock';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotCMSContentType } from 'dotcms-models';

import { DotRelationshipTreeComponent } from './dot-relationship-tree.component';

const messageServiceMock = new MockDotMessageService({
    'relationship.query.title': 'Lucene Query'
});

const fakeContentType: DotCMSContentType = {
    ...dotcmsContentTypeBasicMock,
    id: '1234567890',
    name: 'ContentTypeName',
    variable: 'helloVariable',
    baseType: 'testBaseType'
};

fdescribe('DotRelationshipTreeComponent', () => {
    describe('with children', () => {
        let component: DotRelationshipTreeComponent;
        let fixture: ComponentFixture<DotRelationshipTreeComponent>;
        let de: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [DotRelationshipTreeComponent],
                imports: [DotIconModule, DotPipesModule, DotCopyButtonModule],
                providers: [
                    {
                        provide: DotMessageService,
                        useValue: messageServiceMock
                    }
                ]
            }).compileComponents();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(DotRelationshipTreeComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            component.velocityVar = 'Parent.Children';
            component.contentType = fakeContentType;
            fixture.detectChanges();
        });

        it('should have the lucene query section if it has a dot', () => {
            const title = de.query(By.css('[data-testId="query-title"]'));
            const code = de.query(By.css('[data-testId="query-code"]'));

            expect(title.nativeElement.innerText).toBe('Lucene Query');
            expect(code.nativeElement.innerText).toBe('+Parent.Children::$ContentTypeName.id');
        });

        it('should have contentType with dot-icon and its active class', () => {
            const parentText = de.query(By.css('[data-testId="dot-tree-parent-text"]'));
            const icon = parentText.nativeElement.previousSibling;
            expect(icon.classList).toContain('dot-tree--active');
        });

        it('should set child and field name correctly', () => {
            const children = de.query(By.css('[data-testId="dot-tree-child-text"]'));
            expect(children.nativeElement.innerText).toBe('Parent - Children');
        });
    });

    describe('without children', () => {
        let component: DotRelationshipTreeComponent;
        let fixture: ComponentFixture<DotRelationshipTreeComponent>;
        let de: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [DotRelationshipTreeComponent],
                imports: [DotIconModule, DotPipesModule, DotCopyButtonModule],
                providers: [
                    {
                        provide: DotMessageService,
                        useValue: messageServiceMock
                    }
                ]
            }).compileComponents();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(DotRelationshipTreeComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            component.velocityVar = 'Parent';
            component.contentType = fakeContentType;
            fixture.detectChanges();
        });

        it('should not have the lucene query section if velocityVar does not have a dot', () => {
            const title = de.query(By.css('[data-testId="query-title"]'));
            expect(title).toBeNull();
        });

        it('should have contentType as active and as children of current selected field', () => {
            const children = de.query(By.css('[data-testId="dot-tree-child-text"]'));
            const dotIcon = children.nativeElement.previousSibling;
            expect(dotIcon.classList).toContain('dot-tree--active');
        });
    });
});
