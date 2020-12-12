import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { merge, Observable } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';

import { DotContentletEditorService } from '../../services/dot-contentlet-editor.service';

/**
 * Allow user to add a contentlet to DotCMS instance
 *
 * @export
 * @class DotCreateContentletComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-create-contentlet',
    templateUrl: './dot-create-contentlet.component.html',
    styleUrls: ['./dot-create-contentlet.component.scss']
})
export class DotCreateContentletComponent implements OnInit {
    @Output() close: EventEmitter<any> = new EventEmitter();
    url$: Observable<string>;
    @Output()
    custom: EventEmitter<any> = new EventEmitter();

    private contentLoaded: string;

    constructor(
        private dotRouterService: DotRouterService,
        private dotContentletEditorService: DotContentletEditorService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.url$ = merge(
            this.dotContentletEditorService.createUrl$,
            this.route.data.pipe(pluck('url'))
        ).pipe(filter((url: string) => !!url));
    }

    /**
     * Handle close event
     *
     * @memberof DotCreateContentletComponent
     */
    onClose(event): void {
        if (this.contentLoaded !== 'Page') {
            this.dotRouterService.goToContent();
        }
        this.close.emit(event);
    }

    /**
     * Handle custom event
     *
     * @memberof DotCreateContentletComponent
     */
    onCustom(event): void {
        if (event.detail?.name === 'edit-contentlet-loaded') {
            this.contentLoaded = event.detail.data['contentType'];
        }
        this.custom.emit(event);
    }
}
