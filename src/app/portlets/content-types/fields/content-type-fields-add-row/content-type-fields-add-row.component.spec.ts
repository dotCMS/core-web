import { ContentTypeFieldsAddRowComponent } from './content-type-fields-add-row.component';
import { MessageService } from './../../../../api/services/messages-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/primeng';
import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement, Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Field } from '../';
import { Observable } from 'rxjs/Observable';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TestHotkeysMock } from './../../../../test/hotkeys-service.mock';
import { MockMessageService } from './../../../../test/message-service.mock';

// @Component({
//     selector: '<dot-test></dot-test>',
//     template: '<dot-add-rows [colNumberOptions]="colNumberOptions" [disabled]="disabled" toolTips="toolTips"></dot-add-rows>'
// })
// class TestHostComponent {
//     @Input() colNumberOptions: number[];
//     @Input() disabled = false;
//     @Input() toolTips: string[];
// }

describe('ContentTypeFieldsAddRowComponent', () => {
    let comp: ContentTypeFieldsAddRowComponent;
    // let fixture: ComponentFixture<TestHostComponent>;
    let fixture: ComponentFixture<ContentTypeFieldsAddRowComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let testHotKeysMock: TestHotkeysMock;

    const messageServiceMock = new MockMessageService({
        'contenttypes.content.add_rows': 'Add Rows'
    });

    beforeEach(() => {
        testHotKeysMock = new TestHotkeysMock();

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsAddRowComponent
                // TestHostComponent
            ],
            imports: [TooltipModule, BrowserAnimationsModule],
            providers: [
                { provide: HotkeysService, useValue: testHotKeysMock },
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        // fixture = DOTTestBed.createComponent(TestHostComponent);
        fixture = DOTTestBed.createComponent(ContentTypeFieldsAddRowComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        el = de.nativeElement;

        // comp.selectedColumnIndex = 0;
    });

    it('should display the add rows button by default', () => {
        const addRowContainer = de.query(By.css('.dot-add-rows__container'));
        const buttonElement = de.query(By.css('button'));

        fixture.detectChanges();

        expect(addRowContainer.nativeElement.classList.contains('dot-add-rows__add')).toEqual(true);
        expect(buttonElement).toBeTruthy();
    });

    it('should display a rows seelction after click on Add Rows button', () => {
        fixture.detectChanges();
        const addRowContainer = de.query(By.css('.dot-add-rows__container'));

        const addButton = de.nativeElement.querySelector('.dot-add-rows-button__container button');
        addButton.click();
        fixture.detectChanges();

        expect(addRowContainer.nativeElement.classList.contains('dot-add-rows__select')).toEqual(true);
    });

    it('should focus the first column selection after click on Add Rows button', () => {
        fixture.detectChanges();

        comp.selectColumnState();

        const columnSelectionList = de.query(By.css('.dot-add-rows-columns-list__container'));
        const firstElement = columnSelectionList.children[0];

        expect(firstElement.nativeElement.classList).toContain('active');

        expect(document.activeElement).toBe(firstElement.nativeElement);
    });

    it('should bind keyboard events after click on Add Rows button', () => {
        fixture.detectChanges();

        spyOn(comp, 'setKeyboardEvent');

        const addButton = de.nativeElement.querySelector('.dot-add-rows-button__container button');
        addButton.click();
        fixture.detectChanges();

        expect(comp.setKeyboardEvent).toHaveBeenCalledTimes(4);
    });

    it('should escape to add state', () => {
        spyOn(comp, 'removeFocus');
        spyOn(testHotKeysMock, 'remove');

        fixture.detectChanges();

        const addButton = de.nativeElement.querySelector('.dot-add-rows-button__container button');
        addButton.click();
        fixture.detectChanges();

        expect(comp.rowState).toBe('select');

        testHotKeysMock.callback(['esc']);
        fixture.detectChanges();

        expect(comp.rowState).toEqual('add', 'set state to add');
        expect(comp.selectedColumnIndex).toEqual(0, 'set column index to zero');
        expect(testHotKeysMock.remove).toHaveBeenCalledTimes(1);
        expect(comp.removeFocus).toHaveBeenCalledTimes(1);
    });

    it('should go to last item when left key is preseed while in first item', () => {
        fixture.detectChanges();
        comp.selectColumnState();
        fixture.detectChanges();
        testHotKeysMock.callback(['left']);

        expect(comp.selectedColumnIndex).toEqual(comp.colNumberOptions.length - 1);
    });

    it('should add focus and active to previous item after using left keyboard', () => {
        fixture.detectChanges();
        comp.selectColumnState();
        comp.onMouseEnter(2);
        fixture.detectChanges();

        const items = de.queryAll(By.css('li'));

        expect(items[2].nativeElement.classList).toContain('active');

        testHotKeysMock.callback(['left']);
        fixture.detectChanges();

        expect(items[1].nativeElement.classList).toContain('active');
    });

    it('When using right keyboard event column index should not be greater than 3', () => {
        spyOn(comp, 'setFocus');
        comp.selectColumnState();
        // comp.setFocus(null, 0);

        for (let i = 0; i < 5; i++) {
            testHotKeysMock.callback(['right']);
            expect(comp.selectedColumnIndex).not.toBeGreaterThan(3);
        }
    });

    it('Should add focus and active li after using right keyboard', () => {
        fixture.detectChanges();
        const lis = de.queryAll(By.css('li'));
        const previousLiBeforeLeftEvent = lis[0];
        let nextLiAfterLeftEvent;

        spyOn(comp, 'setFocus');
        comp.selectColumnState();

        testHotKeysMock.callback(['right']);
        if (comp.selectedColumnIndex > 0) {
            fixture.detectChanges();
            // comp.setFocus(null, comp.selectedColumnIndex);
            nextLiAfterLeftEvent = lis[comp.selectedColumnIndex];
        }

        expect(previousLiBeforeLeftEvent.nativeElement.className).toEqual('dot-add-rows-columns-list__item');
        expect(nextLiAfterLeftEvent.nativeElement.className).toEqual('dot-add-rows-columns-list__item active');
    });

    it('should select columns number after click on li', () => {
        fixture.detectChanges();
        const lis = de.queryAll(By.css('li'));

        spyOn(comp.selectColums, 'emit');
        comp.selectColums.subscribe(col => {
            expect(col).toEqual(2);
        });

        lis[1].nativeElement.click();
    });

    it('should select columns number after use enter keyboard on li', () => {
        spyOn(comp, 'setFocus');
        spyOn(comp, 'removeFocus');
        comp.selectColumnState();
        // comp.setFocus(null, 0);
        // comp.removeFocus(null, 0);

        spyOn(comp.selectColums, 'emit');

        testHotKeysMock.callback(['enter']);

        expect(comp.selectColums.emit).toHaveBeenCalledWith(1);
    });

    it('should remove hotkeysService on destroy', () => {
        const hoykeys: Hotkey[] = <Hotkey[]>testHotKeysMock.get(['left', 'right', 'enter', 'esc']);
        const spyMethod = spyOn(testHotKeysMock, 'remove');

        comp.ngOnDestroy();

        expect(spyMethod).toHaveBeenCalledWith(hoykeys);
    });
});
