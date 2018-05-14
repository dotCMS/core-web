import { Component, Input, SimpleChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotContentletEditorService } from '../services/dot-add-contentlet.service';

@Component({
    selector: 'dot-edit-contentlet',
    templateUrl: './dot-edit-contentlet.component.html',
    styleUrls: ['./dot-edit-contentlet.component.scss']
})
export class DotEditContentletComponent implements OnInit {
    @Input() inode: string;
    @Output() load: EventEmitter<boolean> = new EventEmitter();

    url: Observable<string>;

    constructor(private dotContentletEditorService: DotContentletEditorService) {}

    ngOnInit() {
        this.url = this.dotContentletEditorService.edit$;
    }

    /**
     * Handle close dialog event
     *
     * @memberof DotAddContentletComponent
     */
    onClose(): void {
        this.dotContentletEditorService.clear();
    }

    /**
     * Call the keyDown method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onKeyDown($event): void {
        if (this.dotContentletEditorService.keyDown) {
            this.dotContentletEditorService.keyDown($event);
        }
    }

    /**
     * Call the load method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onLoad($event): void {
        if (this.dotContentletEditorService.load) {
            this.dotContentletEditorService.load($event);
        }
    }
}
