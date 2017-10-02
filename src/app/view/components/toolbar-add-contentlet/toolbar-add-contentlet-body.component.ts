import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StructureTypeView, ContentTypeView } from '../../../shared/models/contentlet';


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-toolbar-add-contentlet-body',
    styleUrls: ['./toolbar-add-contentlet-body.component.scss'],
    templateUrl: 'toolbar-add-contentlet-body.component.html'
})
export class ToolbarAddContenletBodyComponent {
    @Input() structureTypeViews: StructureTypeView[];
    @Input() showMore = false;

    @Output() select = new EventEmitter<any>();
    @Output() more = new EventEmitter<any>();

    constructor(private router: Router) {}

    clickMore(event): boolean {
        event.preventDefault();
        this.more.emit();
        return false;
    }
}
