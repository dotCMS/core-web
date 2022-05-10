import { Component, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';

interface ImageMetaData {
    title?: string;
    alt?: string;
    src: string;
}

@Component({
    selector: 'dotcms-image-form',
    templateUrl: './image-form.component.html',
    styleUrls: ['./image-form.component.scss']
})
export class ImageFormComponent {
    @ViewChild('input') input: ElementRef;

    @Output() imageMeta: EventEmitter<ImageMetaData> = new EventEmitter();

    @Input() data: ImageMetaData = {
        title: '',
        alt: '',
        src: ''
    };

    onSubmit() {
        console.log('LLAMADO?');
        this.imageMeta.emit(this.data);
    }
}
