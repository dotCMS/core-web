import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularNodeViewComponent } from '@dotcms/block-editor';

@Component({
    selector: 'dotcms-image-block',
    templateUrl: './image-block.component.html',
    styleUrls: ['./image-block.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageBlockComponent extends AngularNodeViewComponent implements OnInit {
    data: {
        asset: string;
    };

    ngOnInit(): void {
        this.data = this.node.attrs.data;
    }
}
