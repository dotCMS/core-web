import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularNodeViewComponent } from '../../../NodeViewRenderer';

@Component({
    selector: 'dotcms-contentlet-block',
    templateUrl: './contentlet-block.component.html',
    styleUrls: ['./contentlet-block.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentletBlockComponent extends AngularNodeViewComponent implements OnInit {
    public data;

    ngOnInit() {
        this.data = this.node.attrs.data;
    }

    getContentState({ live, working, deleted, hasLiveVersion }) {
        return { live, working, deleted, hasLiveVersion };
    }
}
