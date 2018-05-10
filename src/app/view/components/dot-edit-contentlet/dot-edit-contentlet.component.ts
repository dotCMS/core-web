import { Component, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenuService } from '../../../api/services/dot-menu.service';

@Component({
    selector: 'dot-edit-contentlet',
    templateUrl: './dot-edit-contentlet.component.html',
    styleUrls: ['./dot-edit-contentlet.component.scss']
})
export class DotEditContentletComponent implements OnChanges {
    @Input() inode: string;
    @Output() close: EventEmitter<boolean> = new EventEmitter();

    url: Observable<string>;

    constructor(private dotMenuService: DotMenuService) {}

    ngOnChanges(changes: SimpleChanges) {
        this.url = changes.inode.currentValue ? this.getUrl(changes.inode.currentValue) : Observable.of(null);
    }

    /**
     * Handle close dialog event
     *
     * @memberof DotEditContentletComponent
     */
    onClose(): void {
        this.close.emit();
    }

    private getUrl(inode: string): Observable<string> {
        return this.dotMenuService
            .getDotMenuId('content')
            .take(1)
            .map((portletId: string) => {
                return [
                    `/c/portal/layout`,
                    `?p_l_id=${portletId}`,
                    `&p_p_id=content`,
                    `&p_p_action=1`,
                    `&p_p_state=maximized`,
                    `&p_p_mode=view`,
                    `&_content_struts_action=%2Fext%2Fcontentlet%2Fedit_contentlet`,
                    `&_content_cmd=edit&inode=${inode}`
                ].join('');
            });
    }
}
