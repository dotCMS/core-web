import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'dot-textarea-content',
    templateUrl: './dot-textarea-content.component.html',
    styleUrls: ['./dot-textarea-content.component.scss']
})
export class DotTextareaContentComponent implements OnInit {
    @Input() show = [];
    @Input() codeEditor: any = {
        styles: {
            height: '300px'
        },
        options: {
            printMargin: false,
        }
    };

    value = '';
    selectOptions: SelectItem[] = [];
    selected: string;

    constructor() {
    }

    ngOnInit() {
        if (this.show.length) {
            this.show.forEach(item => {
                this.selectOptions.push({
                    label: `${item.charAt(0).toUpperCase()}${item.slice(1)}`,
                    value: item
                });
            });
        } else {
            this.selectOptions = [
                { label: 'Plain', value: 'plain' },
                { label: 'Code', value: 'code' },
                { label: 'WYSIWYG', value: 'wysiwyg' }
            ];
        }
        this.selected = this.selectOptions[0].value;
    }

    onModelChange(value) {
        this.value = value;
    }
}
