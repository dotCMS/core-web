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

@Directive({
    host: {
        '[style.overflow]': '"hidden"',
        '[style.position]': '"relative"',
    },
    selector: '[dotRipple]'
})
export class DotRippleEffectDirective {

    private WHITE_COLOR = 'rgb(255, 255, 255)';
    private ANIMATION_DURATION_MILLIS = 650;
    private EFFECT_DEFAULT_COLOR = 'rgba(0, 0, 0, 0.2)';

    constructor(private host: ElementRef, private renderer: Renderer, private colorUtil: ColorUtil) {
    }

    @HostListener('click', ['$event'])
    onClick(event: any): void {
        let hostNativeElement: any = this.host.nativeElement;

        let divElement = this.createDiv( event );
        let animation = this.createAnimation(divElement);
        animation.play();

        window.setTimeout(() => {
            this.renderer.detachView([divElement]);
        }, 2000);
    }

    private createDiv(event: any): any {
        let hostNativeElement: any = this.host.nativeElement;
        let divElement = this.renderer.createElement(hostNativeElement, 'div');

        let btnOffset = hostNativeElement.getBoundingClientRect();
        let  xPos = event.pageX - btnOffset.left;
        let  yPos = event.pageY - btnOffset.top;
        let hostWidth = hostNativeElement.clientWidth;
        let hostHeight = hostNativeElement.clientHeight;

        let divWidth = (hostWidth / 8);
        let divHeight = (hostHeight / 2);
        let divLeft = (xPos - (divWidth / 2));
        let divTop = (yPos - (divHeight / 2));

        this.renderer.setElementStyle(divElement, 'position', 'absolute');
        this.renderer.setElementStyle(divElement, 'border-radius', '100%');
        this.renderer.setElementStyle(divElement, 'width',  `${divWidth}px`);
        this.renderer.setElementStyle(divElement, 'height',  `${divHeight}px`);
        this.renderer.setElementStyle(divElement, 'background', this.getRippleEffectsColor());
        this.renderer.setElementStyle(divElement, 'top', `${divTop}px`);
        this.renderer.setElementStyle(divElement, 'left',  `${divLeft}px`);

        return divElement;
    }

    private getRippleEffectsColor(): string {
        let hostNativeElement: any = this.host.nativeElement;
        let hostBackgroundColor = window.getComputedStyle(hostNativeElement, null).backgroundColor;

        let isBright = this.colorUtil.getBrightness(hostBackgroundColor);
        return  !isBright ?  this.EFFECT_DEFAULT_COLOR : this.WHITE_COLOR;
    }

    private createAnimation(element: any): AnimationPlayer {
        const startingStyles: AnimationStyles = {
            styles: [{
                opacity: 0.4,
                transform: 'scale(1)'
            }]
        };

        const keyframes: AnimationKeyframe[] = [{
            offset: 0,
            styles: {
                styles: [{
                    opacity: 0,
                    transform: 'scale(25)'
                }]
            }
        }];

        return this.renderer.animate(element, startingStyles, keyframes, this.ANIMATION_DURATION_MILLIS, 0, 'linear');
    }
}