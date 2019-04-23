import { KeepHtmlPipe } from './../../pipes/keep-html.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DotLargeMessageDisplayComponent } from './dot-large-message-display.component';
import { Injectable, DebugElement } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    DotLargeMessageDisplayParams,
    DotLargeMessageDisplayService
} from './services/dot-large-message-display.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { By } from '@angular/platform-browser';

@Injectable()
export class DotLargeMessageDisplayServiceMock {
    _messages: BehaviorSubject<DotLargeMessageDisplayParams> = new BehaviorSubject(null);

    sub(): Observable<DotLargeMessageDisplayParams> {
        return this._messages.asObservable();
    }

    push(message: DotLargeMessageDisplayParams): void {
        this._messages.next(message);
    }

    clear(): void {
        this._messages.next(null);
    }
}

describe('DotLargeMessageDisplayComponent', () => {
    let component: DotLargeMessageDisplayComponent;
    let fixture: ComponentFixture<DotLargeMessageDisplayComponent>;
    let dialog: DebugElement;
    const dotLargeMessageDisplayServiceMock: DotLargeMessageDisplayServiceMock = new DotLargeMessageDisplayServiceMock();

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DotDialogModule],
            declarations: [DotLargeMessageDisplayComponent, KeepHtmlPipe],
            providers: [{ provide: DotLargeMessageDisplayService, useValue: dotLargeMessageDisplayServiceMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotLargeMessageDisplayComponent);
        component = fixture.componentInstance;
        spyOn(dotLargeMessageDisplayServiceMock, 'sub').and.callThrough();
        spyOn(dotLargeMessageDisplayServiceMock, 'clear').and.callThrough();
    });

    it('should create DotLargeMessageDisplayComponent', () => {
        dotLargeMessageDisplayServiceMock.push({
            title: 'title Test',
            height: '200',
            width: '1000',
            body: 'bodyTest',
            code: { lang: 'eng', content: 'codeTest' }
        });
        fixture.detectChanges();
        dialog = fixture.debugElement.query(By.css('dot-dialog'));

        const bodyElem = fixture.debugElement.query(By.css('.dialog-message__body'));
        const codeElem = fixture.debugElement.query(By.css('.dialog-message__code'));
        expect(dialog.componentInstance.visible).toBe(true);
        expect(dialog.componentInstance.header).toBe('title Test');
        expect(dialog.componentInstance.width).toBe('1000');
        expect(dialog.componentInstance.height).toBe('200');
        expect(bodyElem.nativeElement.innerHTML.trim()).toBe('bodyTest');
        expect(codeElem.nativeElement.innerHTML.trim()).toBe('codeTest');
        expect(dotLargeMessageDisplayServiceMock.sub).toHaveBeenCalledTimes(1);
        expect(component.data$).not.toBeUndefined();
    });

    it('should clear the DotLargeMessageDisplayService on dialog hide', () => {
        dialog.triggerEventHandler('hide', {});
        expect(dotLargeMessageDisplayServiceMock.clear).toHaveBeenCalled();
    });

    it('should set default height and width', () => {
        dotLargeMessageDisplayServiceMock.push({
            title: 'title Test',
            body: 'bodyTest',
            code: { lang: 'eng', content: 'codeTest' }
        });
        fixture.detectChanges();
        dialog = fixture.debugElement.query(By.css('dot-dialog'));

        expect(dialog.componentInstance.width).toBe('500px');
        expect(dialog.componentInstance.height).toBe('400px');
    });
});
