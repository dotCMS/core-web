import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DotCMSContentType } from '@dotcms/dotcms-models';
import { Subject } from 'rxjs';
import { DotContentletEditorService } from '@components/dot-contentlet-editor/services/dot-contentlet-editor.service';

@Component({
    selector: 'dot-palette-content-type',
    templateUrl: './dot-palette-content-type.component.html',
    styleUrls: ['./dot-palette-content-type.component.scss']
})
export class DotPaletteContentTypeComponent {
    @Input() items: DotCMSContentType[] = [];
    @Output() show = new EventEmitter<string>();
    filter: string;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private dotContentletEditorService: DotContentletEditorService) {}

    /**
     * Notify the dragging element to the service, and finally to the edit iframe.
     *
     * @param DotCMSContentType contentType
     * @memberof DotContentPaletteComponent
     */
    dragStart(contentType: DotCMSContentType): void {
        this.dotContentletEditorService.setDraggedContentType(contentType);
    }

    showContentTypesList(contentTypeVariable: string): void {
        this.show.emit(contentTypeVariable);
    }

    filterContentTypes(value: string): void {
        this.filter = value;
    }
}
