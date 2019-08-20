import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DotPageRenderState } from '@portlets/dot-edit-page/shared/models';
import { DotMessageService } from '@services/dot-messages-service';

/**
 * Basic page information for edit mode
 *
 * @export
 * @class DotEditPageInfoComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-page-lock-info',
    templateUrl: './dot-edit-page-lock-info.component.html',
    styleUrls: ['./dot-edit-page-lock-info.component.scss']
})
export class DotEditPageLockInfoComponent implements OnInit {
    @ViewChild('lockedPageMessage') lockedPageMessage: ElementRef;

    show = false;

    private _state: DotPageRenderState;

    constructor(public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'editpage.toolbar.page.cant.edit',
                'editpage.toolbar.page.locked.by.user'
            ])
            .subscribe();
    }

    @Input('pageState')
    set pageState(value: DotPageRenderState) {
        this._state = value;
        this.show = value.state.lockedByAnotherUser && value.page.canEdit;
    }

    get pageState(): DotPageRenderState {
        return this._state;
    }

    /**
     * Make the lock message blink with css
     *
     * @memberof DotEditPageInfoComponent
     */
    blinkLockMessage(): void {
        const blinkClass = 'page-info__locked-by-message--blink';

        this.lockedPageMessage.nativeElement.classList.add(blinkClass);
        setTimeout(() => {
            this.lockedPageMessage.nativeElement.classList.remove(blinkClass);
        }, 500);
    }
}
