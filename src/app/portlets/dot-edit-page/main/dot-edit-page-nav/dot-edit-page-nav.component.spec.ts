import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DotEditPageNavComponent } from './dot-edit-page-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { By } from '@angular/platform-browser';

describe('DotEditPageNavComponent', () => {
    let component: DotEditPageNavComponent;
    let fixture: ComponentFixture<DotEditPageNavComponent>;

    const messageServiceMock = new MockDotMessageService({
        'editpage.toolbar.nav.content': 'Content',
        'editpage.toolbar.nav.layout': 'Layout',
        'editpage.toolbar.nav.code': 'Code'
    });

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule],
                declarations: [DotEditPageNavComponent],
                providers: [{ provide: DotMessageService, useValue: messageServiceMock }]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditPageNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have menu list', () => {
        const menuList = fixture.debugElement.query(By.css('.edit-page-nav'));
        expect(menuList).not.toBeNull();
    });

    it('should have just content item', () => {
        const menuListItems = fixture.debugElement.queryAll(By.css('.edit-page-nav__item'));
        expect(menuListItems.length).toEqual(1);

        const labels = ['Content'];
        menuListItems.forEach((item, index) => {
            expect(item.nativeElement.textContent).toContain(labels[index]);
        });
    });

    it('should have basic menu items', () => {
        component.templateState = {
            editable: true,
            advanced: false
        };
        fixture.detectChanges();
        const menuListItems = fixture.debugElement.queryAll(By.css('.edit-page-nav__item'));
        expect(menuListItems.length).toEqual(2);

        const labels = ['Content', 'Layout'];
        menuListItems.forEach((item, index) => {
            expect(item.nativeElement.textContent).toContain(labels[index]);
        });
    });

    it('should have code option', () => {
        component.templateState = {
            editable: true,
            advanced: true
        };
        fixture.detectChanges();

        const menuListItems = fixture.debugElement.queryAll(By.css('.edit-page-nav__item'));
        expect(menuListItems.length).toEqual(2);

        const labels = ['Content', 'Code'];
        menuListItems.forEach((item, index) => {
            expect(item.nativeElement.textContent).toContain(labels[index]);
        });
    });

    it('should have code option disabled', () => {
        component.templateState = {
            editable: false,
            advanced: true
        };
        fixture.detectChanges();

        const menuListItems = fixture.debugElement.queryAll(By.css('.edit-page-nav__item'));
        expect(menuListItems[1].nativeElement.classList).toContain('edit-page-nav__item--disabled');
    });
});
