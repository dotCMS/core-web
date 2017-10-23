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

fdescribe('ContentTypeFieldsAddRowComponent', () => {
    let comp: ContentTypeFieldsAddRowComponent;
    let fixture: ComponentFixture<ContentTypeFieldsAddRowComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let testHotKeysMock: TestHotkeysMock;
    let columns: number[];
    let disabled: boolean;
    let toolTips: string[];

    const messageServiceMock = new MockMessageService({
        'contenttypes.content.add_rows': 'Add Rows',
        'contenttypes.content.one_column': 'One column',
        'contenttypes.content.two_columns': 'Second column',
        'contenttypes.content.three_columns': 'Three columns',
        'contenttypes.content.four_columns': 'Four columns'
    });

    beforeEach(() => {
        testHotKeysMock = new TestHotkeysMock();

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsAddRowComponent
            ],
            imports: [TooltipModule, BrowserAnimationsModule],
            providers: [
                { provide: HotkeysService, useValue: testHotKeysMock },
                { provide: MessageService, useValue: messageServiceMock}
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypeFieldsAddRowComponent);
        de = fixture.debugElement;
        comp = fixture.componentInstance;
        el = de.nativeElement;
    });

    it('should render disabled input', () => {
        disabled = true;
        comp.disabled = disabled;

        fixture.detectChanges();

        const buttonElement = de.query(By.css('button'));

        expect(comp.disabled).toEqual(buttonElement.nativeElement.disabled);
    });

    it('should render columns input', () => {
        const columnSelectionList = de.query(By.css('.dot-add-rows-columns-list__container'));
        columns = [1, 2, 3];

        comp.columns = columns;

        fixture.detectChanges();

        expect(comp.columns.length).toEqual(columnSelectionList.children.length);
    });

    it('should render tooltip input data', () => {
        toolTips = ['contenttypes.content.one_column',
        'contenttypes.content.four_columns'];

        comp.ngOnInit();
        comp.toolTips = toolTips;

        fixture.detectChanges();

        const columnSelectionList = de.query(By.css('.dot-add-rows-columns-list__container'));
        const columnSelectionItems = columnSelectionList.nativeElement.children;

        expect(comp.i18nMessages[toolTips[1]]).toEqual(columnSelectionItems[1].attributes[9].textContent);
    });

    it('should display the add rows button by default', () => {
        const addRowContainer = de.query(By.css('.dot-add-rows-button__container'));
        const buttonElement = de.query(By.css('button'));

        fixture.detectChanges();

        expect(addRowContainer.nativeElement.classList.contains('dot-add-rows__add')).toEqual(true);
        expect(buttonElement).toBeTruthy();
    });

    it('should display row selection after click on Add Rows button', () => {
        fixture.detectChanges();
        const addRowContainer = de.query(By.css('.dot-add-rows-columns-list__container'));

        const addButton = de.query(By.css('button'));
        addButton.nativeElement.click();
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

    it('should go to last item when left key is pressed while in first item', () => {
        fixture.detectChanges();
        comp.selectColumnState();
        fixture.detectChanges();
        testHotKeysMock.callback(['left']);

        expect(comp.selectedColumnIndex).toEqual(comp.columns.length - 1);
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

    it('should go to second item when right key is pressed while in first item', () => {
        fixture.detectChanges();
        comp.selectColumnState();
        fixture.detectChanges();
        testHotKeysMock.callback(['right']);

        expect(comp.selectedColumnIndex).toEqual(1);
    });

    it('Should add focus and active to next item after using right keyboard', () => {
        fixture.detectChanges();
        comp.selectColumnState();
        comp.onMouseEnter(2);
        fixture.detectChanges();

        const items = de.queryAll(By.css('li'));

        expect(items[2].nativeElement.classList).toContain('active');

        testHotKeysMock.callback(['right']);
        fixture.detectChanges();

        expect(items[3].nativeElement.classList).toContain('active');
    });

    it('should select columns number after click on li', () => {
        fixture.detectChanges();
        let colsToEmit: number;

        const addButton = de.query(By.css('button'));
        const lis = de.queryAll(By.css('li'));
        addButton.nativeElement.click();

        comp.selectColums.subscribe(cols => colsToEmit = cols);

        lis[0].nativeElement.click();

        expect(colsToEmit).toEqual(1);
    });

    it('should select columns number after use enter keyboard on li', () => {
        fixture.detectChanges();
        comp.selectColumnState();

        const spy = spyOn(comp.selectColums, 'emit');

        testHotKeysMock.callback(['enter']);

        expect(spy).toHaveBeenCalledWith(1);
    });

    it('should display row selection after ctrl+a combo keyboard event', () => {
        fixture.detectChanges();
        const addRowContainer = de.query(By.css('.dot-add-rows-columns-list__container'));

        testHotKeysMock.callback(['ctrl+a']);
        fixture.detectChanges();

        expect(addRowContainer.nativeElement.classList.contains('dot-add-rows__select')).toEqual(true);
    });

    it('should set toolTip value', () => {
        toolTips = [
            'contenttypes.content.one_column',
            'contenttypes.content.two_columns',
            'contenttypes.content.three_columns',
            'contenttypes.content.four_columns'
        ];
        fixture.detectChanges();

        const columnSelectionList = de.query(By.css('.dot-add-rows-columns-list__container'));
        const columnSelectionItems = columnSelectionList.nativeElement.children;

        expect(comp.i18nMessages[toolTips[1]]).toEqual(columnSelectionItems[1].attributes[9].textContent);
    });

    it('should remove hotkeysService on destroy', () => {
        const hoykeys: Hotkey[] = <Hotkey[]>testHotKeysMock.get(['left', 'right', 'enter', 'esc']);
        const spyMethod = spyOn(testHotKeysMock, 'remove');

        comp.ngOnDestroy();

        expect(spyMethod).toHaveBeenCalledWith(hoykeys);
    });
});
