import { Directive, ElementRef, Renderer, Input, OnChanges, Renderer2 } from '@angular/core';

/**
 * Directives material design floating label textfield.
 * How to use:
 * <code>
 * <span dotMdInputtext label="Placeholder">
 *   <input type="text" pInputText />
 * </span>
 * </code>
 */
@Directive({
    selector: '[dotMdInputtext]'
})
export class MaterialDesignTextfieldDirective implements OnChanges {
    @Input() private label: string;
    private hostNativeElement: HTMLElement;
    private floatingLabel: HTMLElement;

    constructor(private host: ElementRef, private renderer2: Renderer2) {
        this.hostNativeElement = host.nativeElement;
        this.hostNativeElement.className = 'md-inputtext';
    }

    ngOnChanges(): void {
        this.setLabel();
    }

    setLabel(): void {
        if (!this.floatingLabel) {
            this.floatingLabel = this.renderer2.createElement('label');
        }
        this.floatingLabel.innerHTML = this.label;
    }
}
