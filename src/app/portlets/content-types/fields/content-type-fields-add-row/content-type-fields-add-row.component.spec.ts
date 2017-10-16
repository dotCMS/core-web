import { MessageService } from './../../../../api/services/messages-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/primeng';
import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
import { ContentTypeFieldsAddRowComponent } from './';
import { By } from '@angular/platform-browser';
import { Field } from '../';
import { Observable } from 'rxjs/Observable';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TestHotkeysMock } from './../../../../test/hotkeys-service.mock';
import { MockMessageService } from './../../../../test/message-service.mock';

fdescribe('ContentTypeFieldsAddRowComponent', () => {
    let comp: ContentTypeFieldsAddRowComponent;
    let fixture: ComponentFixture<ContentTypeFieldsAddRowComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let testHotKeysMock: TestHotkeysMock;

    const messageServiceMock = new MockMessageService({
        'contenttypes.content.add_rows': 'Add Rows'
    });

    beforeEach(async(() => {
        testHotKeysMock = new TestHotkeysMock();

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsAddRowComponent
            ],
            imports: [
                TooltipModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: HotkeysService, useValue: testHotKeysMock },
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypeFieldsAddRowComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        comp.ngOnInit();

        fixture.detectChanges();

        const addButton = de.nativeElement.querySelector('.content-type-fields-add-row button');
        spyOn(comp, 'addRow');
        addButton.click();
        comp.addRowSelected = 'expanded';
    }));

    it('should display a row after click on AddRows button', () => {
        const ul = de.query(By.css('ul'));
        const lis = de.queryAll(By.css('li'));

        expect(4).toEqual(lis.length);
    });

    it('should escape to previous step', () => {
        testHotKeysMock.callback('esc');

        expect(comp.addRowSelected).toBe('collapsed');
    });

    it('should be able to use left keyboard to highlight columns', () => {
        testHotKeysMock.callback('left');

        expect(comp.selectedCol).toBe(3);
    });

    it('should be able to use right keyboard to highlight columns', () => {
        testHotKeysMock.callback('right');

        expect(comp.selectedCol).toBe(1);
    });

    it('should select columns number after click on li', () => {
        spyOn(comp.selectedColums, 'emit');
        comp.selectRow(3);

        expect(comp.selectedColums.emit).toHaveBeenCalledWith(3);
    });

    it('should select columns number after use enter keyboard on li', () => {
        spyOn(comp.selectedColums, 'emit');

        testHotKeysMock.callback('enter');
        comp.selectRow(comp.row);

        expect(comp.selectedColums.emit).toHaveBeenCalledWith(1);
    });
});
