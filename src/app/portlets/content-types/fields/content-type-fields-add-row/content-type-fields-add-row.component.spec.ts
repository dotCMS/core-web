import { ContentTypeFieldsAddRowComponent } from './content-type-fields-add-row.component';
import { MessageService } from './../../../../api/services/messages-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/primeng';
import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
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
    }));

    it('should display the add rows button by default', () => {
        const addRowContainer = de.nativeElement.querySelector('.dot-add-rows__container');

        fixture.detectChanges();

        expect(addRowContainer.classList.contains('dot-add-rows__add')).toEqual(true);
    });

    it('should display a row after click on AddRows button', () => {
        fixture.detectChanges();
        const lis = de.queryAll(By.css('li'));

        const addButton = de.nativeElement.querySelector('.dot-add-rows-button__container button');
        spyOn(comp, 'selectColumnState');
        addButton.click();

        expect(lis.length).toEqual(4);
    });

    it('should escape to previous step', () => {
        comp.selectColumnState();

        testHotKeysMock.callback(['esc']);

        expect(comp.rowState).toBe('add');
    });

    it('should be able to use left keyboard to highlight columns', () => {
        comp.selectColumnState();

        for (let i = 0; i < 5; i++) {
            testHotKeysMock.callback(['left']);
            expect(comp.selectedLi).not.toBeLessThan(0);
        }
    });

    it('should be able to use right keyboard to highlight columns', () => {
        comp.selectColumnState();

        for (let i = 0; i < 5; i++) {
            testHotKeysMock.callback(['right']);
            expect(comp.selectedLi).not.toBeGreaterThan(3);
        }
    });

    it('should select columns number after click on li', () => {
        fixture.detectChanges();
        const lis = de.queryAll(By.css('li'));

        spyOn(comp.selectColums, 'emit');
        comp.selectColums.subscribe(col => {
            expect(col).toEqual(2);
        });

        lis[1].nativeElement.click(2);
    });

    it('should select columns number after use enter keyboard on li', () => {
        comp.selectColumnState();

        spyOn(comp.selectColums, 'emit');

        testHotKeysMock.callback(['enter']);

        expect(comp.selectColums.emit).toHaveBeenCalledWith(1);
    });

    it('should remove hotkeysService on destroy', () => {
        const hoykeys: Hotkey[] = <Hotkey[]> testHotKeysMock.get(['left', 'right', 'enter', 'esc']);
        const spyMethod = spyOn(testHotKeysMock, 'remove');

        comp.ngOnDestroy();

        expect(spyMethod).toHaveBeenCalledWith(hoykeys);
    });
});
