import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularNodeViewComponent } from '../../../NodeViewRenderer';

@Component({
    selector: 'dotcms-contentlet-block',
    templateUrl: './contentlet-block.component.html',
    styleUrls: ['./contentlet-block.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentletBlockComponent extends AngularNodeViewComponent implements OnInit {
    @HostBinding('attr.data-drag-handle') handle = true;
    data: {
        title: string;
        inode: string;
    };

    ngOnInit() {
        this.data = this.node.attrs.data;
    }
}
