import { Component, Input, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'dot-textarea-content',
    templateUrl: './dot-textarea-content.component.html',
    styleUrls: ['./dot-textarea-content.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotTextareaContentComponent)
        }
    ]
})
export class DotTextareaContentComponent implements OnInit, ControlValueAccessor {
    @Input() show = [];
    @Input() codeEditor: any = {
        styles: {
            height: '300px'
        },
        options: {
            printMargin: false,
        }
    };

    @Input() value = '';
    selectOptions: SelectItem[] = [];
    selected: string;

    propagateChange = (_: any) => {};

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
        this.propagateChange(this.value);
    }

    /**
     * Update the value and form control
     *
     * @param {any} value
     * @memberof DotTextareaContentComponent
     */
    onModelChange(value) {
        this.value = value;
        this.propagateChange(value);
    }

    /**
     * Update model with external value
     *
     * @param {string} value
     * @memberof DotTextareaContentComponent
     */
    writeValue(value: string): void {
        if (value) {
            this.value = value || '';
        }
    }

    /**
     * Set the call callback to update value on model change
     *
     * @param {any} fn
     * @memberof DotTextareaContentComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
