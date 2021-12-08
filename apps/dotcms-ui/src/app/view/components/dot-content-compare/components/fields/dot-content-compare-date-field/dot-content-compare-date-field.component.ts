import { Component, Input, OnInit } from '@angular/core';
import { DotFormatDateService } from '@services/dot-format-date-service';

export enum FieldWhiteList {
    Text = 'Text',
    Textarea = 'Textarea',
    Checkbox = 'Checkbox',
    'Constant-Field' = 'Constant-Field',
    'Key-Value' = 'Key-Value',
    Radio = 'Radio',
    Select = 'Select',
    'Multi-Select' = 'Multi-Select',
    Tag = 'Tag',
    'Custom-Field' = 'Custom-Field',
    'Hidden-Field' = 'Hidden-Field',
    Image = 'image',
    File = 'File',
    Binary = 'Binary',
    Category = 'Category',

    'Date-and-Time' = 'Date-and-Time',
    Time = 'Time',
    'WYSIWYG' = 'WYSIWYG',
    'Host-Folder' = 'Host-Folder'
}

enum DateType {
    date = 'MM/dd/yyyy',
    Time = 'hh:mm',
    'Date-and-Time' = 'MM/dd/yyyy - hh:mm'
}

@Component({
    selector: 'dot-content-compare-date-field',
    templateUrl: './dot-content-compare-date-field.component.html',
    styleUrls: ['./dot-content-compare-date-field.component.scss']
})
export class DotContentCompareDateFieldComponent implements OnInit {
    constructor(private dotFormatDateService: DotFormatDateService) {}

    // @Input() set value(value: string) {
    //     // this.value = this.dotFormatDateService.format(new Date(value), DateType[this.format]);
    // }
    @Input() value: string;
    @Input() format: string;

    ngOnInit(): void {}
}
