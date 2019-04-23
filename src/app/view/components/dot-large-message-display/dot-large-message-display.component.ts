import {
    DotLargeMessageDisplayService,
    DotLargeMessageDisplayParams
} from './services/dot-large-message-display.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'dot-large-message-display',
    templateUrl: './dot-large-message-display.component.html',
    styleUrls: ['./dot-large-message-display.component.scss']
})
export class DotLargeMessageDisplayComponent implements OnInit, OnDestroy {
    @ViewChild('body') bodyEl: ElementRef;

    data: DotLargeMessageDisplayParams;

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
                    setTimeout(() => {
                        const placeholder = document.createElement('div');
                        placeholder.innerHTML = content.body;

                        Array.from(placeholder.children).forEach((el: HTMLElement) => {
                            this.renderer.appendChild(this.bodyEl.nativeElement, this.getEl(el));
                        });


                        if (content.script) {
                            this.renderer.appendChild(
                                this.bodyEl.nativeElement,
                                this.createScriptEl(content.script)
                            );
                        }
                    }, 0);
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
    close() {
        this.dotLargeMessageDisplayService.clear();
    }

    private getEl(el: HTMLElement): HTMLElement {
        return el.tagName === 'SCRIPT' ? this.createScriptEl(el.innerHTML) : el;
    }

    private createScriptEl(content: string): HTMLScriptElement {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'type', 'text/javascript');
        const text = this.renderer.createText(content);
        this.renderer.appendChild(script, text);

        return script;
    }
}
