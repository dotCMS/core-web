import {
    DotLargeMessageDisplayService,
    DotLargeMessageDisplayParams
} from './services/dot-large-message-display.service';
import { Component, OnInit,  Renderer2, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DotDialogComponent } from '@components/dot-dialog/dot-dialog.component';

@Component({
    selector: 'dot-large-message-display',
    templateUrl: './dot-large-message-display.component.html',
    styleUrls: ['./dot-large-message-display.component.scss']
})
export class DotLargeMessageDisplayComponent implements OnInit, OnDestroy {
    data: DotLargeMessageDisplayParams;
    messages: DotLargeMessageDisplayParams[] = [];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotLargeMessageDisplayService: DotLargeMessageDisplayService,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.dotLargeMessageDisplayService
            .sub()
            .pipe(takeUntil(this.destroy$))
            .subscribe((content: DotLargeMessageDisplayParams) => {
                this.data = content;

                if (content) {
                    this.messages.push(content);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Close dialog's component by clearing messages from service
     *
     * @memberof DotLargeMessageDisplayComponent
     */
    close(messageToRemove: DotLargeMessageDisplayParams) {
       this.messages.splice(this.messages.indexOf(messageToRemove), 1);
    }

    createContent(dialogComponent: DotDialogComponent, content: DotLargeMessageDisplayParams): void {
        setTimeout( () => {
            const placeholder = document.createElement('div');
            placeholder.innerHTML = content.body;

            const body = dialogComponent.dialog.nativeElement.querySelector('.dialog-message__body');
            Array.from(placeholder.children).forEach((el: HTMLElement) => {
                const parsedEl = this.isScriptElement(el.tagName)
                    ? this.createScriptEl(el.innerHTML)
                    : el;
                this.renderer.appendChild(body, parsedEl);
            });

            if (content.script) {
                this.renderer.appendChild(
                    body,
                    this.createScriptEl(content.script)
                );
            }
        }, 0);
    }

    private isScriptElement(tag: string): boolean {
        return tag === 'SCRIPT';
    }

    private createScriptEl(content: string): HTMLScriptElement {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'type', 'text/javascript');
        const text = this.renderer.createText(content);
        this.renderer.appendChild(script, text);

        return script;
    }
}
