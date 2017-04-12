import {
    Directive,
    ElementRef,
    Input,
    HostListener,
    Renderer,
    AnimationPlayer,
    AnimationStyles,
    AnimationKeyframe
} from '@angular/core';
import { ColorUtil } from '../../../api/util/ColorUtil';

/**
 * Directives to ripple effects.
 * How to use:
 * <code>
 *  <button ripple pButton id="login-component-login-submit-button" *ngIf="!isLoginInProgress"
 *                           (click)="logInUser()" [label]="loginButton"></button>
 * </code>
 */
@Directive({
    host: {
        '[style.overflow]': '"hidden"',
        '[style.position]': '"relative"',
    },
    selector: '[ripple]'
})
export class DotRippleEffectDirective {

    private static readonly WHITE_COLOR = 'rgb(255, 255, 255)';
    private static readonly ANIMATION_DURATION_MILLIS = 650;
    private static readonly EFFECT_DEFAULT_COLOR = 'rgba(0, 0, 0, 0.2)';

    constructor(private host: ElementRef, private renderer: Renderer, private colorUtil: ColorUtil) {
    }

    @HostListener('click', ['$event'])
    onClick(event: any): void {
        let hostNativeElement: any = this.host.nativeElement;

        let divElement = this.createDiv( event );

        window.setTimeout(() => {
            this.renderer.detachView([divElement]);
        }, DotRippleEffectDirective.ANIMATION_DURATION_MILLIS);
    }

    private createDiv(event: any): any {
        let hostNativeElement: any = this.host.nativeElement;
        let divElement = this.renderer.createElement(hostNativeElement, 'div');

        let btnOffset = hostNativeElement.getBoundingClientRect();
        let xPos = event.pageX - btnOffset.left;
        let yPos = event.pageY - btnOffset.top;
        let hostHeight = hostNativeElement.clientHeight;

        let divSize: Size = this.getDivSize();
        let divLeft = (xPos - (divSize.width / 2));
        let divTop = (yPos - (divSize.height / 2));

        this.renderer.setElementClass(divElement, 'ripple-effect', true);
        this.renderer.setElementStyle(divElement, 'position',  'absolute');
        this.renderer.setElementStyle(divElement, 'border-radius',  '50%');
        this.renderer.setElementStyle(divElement, 'width',  `${divSize.width}px`);
        this.renderer.setElementStyle(divElement, 'height',  `${divSize.height}px`);
        this.renderer.setElementStyle(divElement, 'background', this.getRippleEffectsColor());
        this.renderer.setElementStyle(divElement, 'top', `${divTop}px`);
        this.renderer.setElementStyle(divElement, 'left',  `${divLeft}px`);

        return divElement;
    }

    private getDivSize(): Size {
        let btnOffset = this.host.nativeElement.getBoundingClientRect();
        let rippleSize = Math.sqrt(btnOffset.width * btnOffset.width +
          btnOffset.height * btnOffset.height) * 2 + 2;

        return {
            height: rippleSize,
            width: rippleSize
        };
    }

    private getRippleEffectsColor(): string {
        let hostNativeElement: any = this.host.nativeElement;
        let hostBackgroundColor = window.getComputedStyle(hostNativeElement, null).backgroundColor;

        let isBright = this.colorUtil.isBrightness(hostBackgroundColor);
        return !isBright ?  DotRippleEffectDirective.EFFECT_DEFAULT_COLOR : DotRippleEffectDirective.WHITE_COLOR;
    }
}

interface Size {
    height: number;
    width: number;
}