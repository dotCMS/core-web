import { Component, Input } from '@angular/core';
import { DotCMSContentType } from '@dotcms/dotcms-models';

@Component({
    selector: 'dot-palette',
    templateUrl: './dot-palette.component.html',
    styleUrls: ['./dot-palette.component.scss']
})
export class DotPaletteComponent {
    @Input() items: DotCMSContentType[] = [];
    contentTypeVariable: string = '';

    constructor() {}

    switchView(variableName?: string): void {
        console.log('***fateher', variableName)
        this.contentTypeVariable = variableName ? variableName : '';
    }

}
