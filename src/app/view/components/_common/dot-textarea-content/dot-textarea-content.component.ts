import { Component, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng'; 7;

@Component({
    selector: 'dot-textarea-content',
    templateUrl: './dot-textarea-content.component.html',
    styleUrls: ['./dot-textarea-content.component.scss']
})
export class DotTextareaContentComponent {
    @Input() selected = 'plain';
    @Input() codeEditor: any = {
        styles: {
            height: '300px'
        },
        options: {
            printMargin: false,
        }
    };

    text = '';
    selectOptions: SelectItem[];

    constructor() {
        this.selectOptions = [];
        this.selectOptions.push({ label: 'Plain', value: 'plain' });
        this.selectOptions.push({ label: 'Code', value: 'code' });
        this.selectOptions.push({ label: 'WYSIWYG', value: 'wysiwyg' });
    }
}
