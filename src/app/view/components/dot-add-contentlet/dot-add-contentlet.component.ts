import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotAddContentLet, DotAddContentletService } from './services/dot-add-contentlet.service';

@Component({
    selector: 'dot-add-contentlet',
    templateUrl: './dot-add-contentlet.component.html',
    styleUrls: ['./dot-add-contentlet.component.scss']
})
export class DotAddContentletComponent implements OnInit {
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    @Output() load: EventEmitter<any> = new EventEmitter();
    url: Observable<string>;

    constructor(private dotAddContentletService: DotAddContentletService) {}

    ngOnInit() {
        this.url = this.dotAddContentletService.action$.map((data: DotAddContentLet) => {
            return data ? this.getUrl(data) : '';
        });
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
     * Call the keyDown method from the service if e'xist
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

    private getUrl(data: DotAddContentLet): string {
        return `/html/ng-contentlet-selector.jsp?ng=true&container_id=${data.container}&add=${data.type}`;
    }
}
