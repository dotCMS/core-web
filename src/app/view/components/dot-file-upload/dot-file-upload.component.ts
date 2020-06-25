import { Component, Input, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotFileUploadComponent)
        }
    ],
    selector: 'dot-file-upload',
    templateUrl: './dot-file-upload.component.html',
    styleUrls: ['./dot-file-upload.component.scss']
})
export class DotFileUploadComponent implements ControlValueAccessor {
    @Input() id: string;
    @Input() previewImageName: string;

    constructor() {}

    @HostListener('dotValueChange', ['$event'])
    public valueChange(event): void {
        this.propagateChange(event.detail.value);
        console.log(event.detail.value);
        this.previewImageName = event.detail.value.name;
        // this.dotFileUploadService.upload(event.detail.value).subscribe((data: any) => {
        //     console.log('***sub data', data);
        // });
    }

    propagateChange = (_: any) => {};

    writeValue(value: string): void {
        if (value) {
            this.previewImageName = value;
            console.log('***writeValuem previewImageName', this.previewImageName);
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    setDisabledState?(_isDisabled: boolean): void {
        throw new Error('setDisabledState not implemented.');
    }
}
