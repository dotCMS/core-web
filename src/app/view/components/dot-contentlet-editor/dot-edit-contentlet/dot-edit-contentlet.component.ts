import { Component, Input, SimpleChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotAddContentletService } from '../services/dot-add-contentlet.service';

@Component({
    selector: 'dot-edit-contentlet',
    templateUrl: './dot-edit-contentlet.component.html',
    styleUrls: ['./dot-edit-contentlet.component.scss']
})
export class DotEditContentletComponent implements OnInit {
    @Input() inode: string;
    @Output() load: EventEmitter<boolean> = new EventEmitter();

    url: Observable<string>;

    constructor(private dotAddContentletService: DotAddContentletService) {}

    ngOnInit() {
        this.url = this.dotAddContentletService.edit$;
    }

    /**
     * Handle close dialog event
     *
     * @memberof DotAddContentletComponent
     */
    onClose(): void {
        this.dotAddContentletService.clear();
    }

    /**
     * Call the keyDown method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onKeyDown($event): void {
        if (this.dotAddContentletService.keyDown) {
            this.dotAddContentletService.keyDown($event);
        }
    }

    /**
     * Call the load method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onLoad($event): void {
        if (this.dotAddContentletService.load) {
            this.dotAddContentletService.load($event);
        }
    }
}
