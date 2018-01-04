import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'base'
})
export class BaseComponent implements OnDestroy {
    public messageMapSubscription;
    public i18nMessages = {};

    constructor(i18nKeys: string[], public messageService: DotMessageService) {
        if (messageService !== null) {
            this.messageMapSubscription = this.messageService.getMessages(i18nKeys).subscribe(res => {
                this.i18nMessages = res;
                this.onMessage();
            });
        }
    }

    ngOnDestroy(): void {
        this.messageMapSubscription.unsubscribe();
    }

    /**
     * Call when the messages are receive
     * @memberOf BaseComponent
     */
    onMessage(): void {}
}
