import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DotRenderedPageState } from '../../shared/models/dot-rendered-page-state.model';
import { DotGlobalMessageService } from '../../../../view/components/_common/dot-global-message/dot-global-message.service';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-edit-page-info',
    templateUrl: './dot-edit-page-info.component.html',
    styleUrls: ['./dot-edit-page-info.component.scss']
})
export class DotEditPageInfoComponent implements OnInit {
    @Input() pageState: DotRenderedPageState;
    @ViewChild('lockedPageMessage') lockedPageMessage: ElementRef;

    constructor(private dotGlobalMessageService: DotGlobalMessageService, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'dot.common.message.pageurl.copied.clipboard',
                'dot.common.message.pageurl.copied.clipboard.error',
                'editpage.toolbar.page.cant.edit',
                'editpage.toolbar.page.locked.by.user'
            ])
            .subscribe();
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

    /**
     * Copy url to clipboard
     *
     * @returns {boolean}
     * @memberof DotEditPageToolbarComponent
     */
    copyUrlToClipboard(): boolean {
        /*
            Aparently this is the only crossbrowser solution so far. If we do this in another place we might have
            to include an npm module.
        */
        const txtArea = document.createElement('textarea');

        txtArea.style.position = 'fixed';
        txtArea.style.top = '0';
        txtArea.style.left = '0';
        txtArea.style.opacity = '0';
        txtArea.value = this.pageState.page.pageURI;
        document.body.appendChild(txtArea);
        txtArea.select();

        let result;

        try {
            result = document.execCommand('copy');
            if (result) {
                this.dotGlobalMessageService.display(this.dotMessageService.get('dot.common.message.pageurl.copied.clipboard'));
            }
        } catch (err) {
            this.dotGlobalMessageService.error(this.dotMessageService.get('dot.common.message.pageurl.copied.clipboard.error'));
        }
        document.body.removeChild(txtArea);

        return result;
    }
}
