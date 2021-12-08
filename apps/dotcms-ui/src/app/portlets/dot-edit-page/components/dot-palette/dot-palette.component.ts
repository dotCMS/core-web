import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { DotCMSContentType } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-palette',
    templateUrl: './dot-palette.component.html',
    styleUrls: ['./dot-palette.component.scss'],
    animations: [
        trigger('inOut', [
            state(
                'contentlet',
                style({
                    transform: 'translateX(-100%)'
                })
            ),
            state(
                'type',
                style({
                    transform: 'translateX(100%)'
                })
            ),
            transition('type => contentlet', animate('250ms')),
            transition('contentlet => type', animate('250ms'))
        ])
    ]
})
export class DotPaletteComponent {
    @Input() items: DotCMSContentType[] = [];
    @Input() languageId: string;
    contentTypeVariable = '';
    state: 'type' | 'contentlet' = 'type';

    /**
     * Sets value on contentTypeVariable variable to show/hide components on the UI
     *
     * @param string [variableName]
     * @memberof DotPaletteContentletsComponent
     */
    switchView(variableName?: string): void {
        this.contentTypeVariable = variableName ? variableName : '';
        this.state = variableName ? 'contentlet' : 'type';
    }
}
