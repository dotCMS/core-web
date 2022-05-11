import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'dotcms-image-importer',
    templateUrl: './image-importer.component.html',
    styleUrls: ['./image-importer.component.scss']
})
export class ImageImporterComponent {
    @Output() importImage: EventEmitter<void> = new EventEmitter();
}
