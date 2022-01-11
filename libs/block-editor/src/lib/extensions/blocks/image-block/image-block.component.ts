import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularNodeViewComponent } from '../../../NodeViewRenderer';

interface imageData { 
    asset: string;
    name: string;
}

@Component({
    selector: 'dotcms-image-block',
    templateUrl: './image-block.component.html',
    styleUrls: ['./image-block.component.scss']
})
export class ImageBlockComponent extends AngularNodeViewComponent implements OnInit {
    
    public data: imageData;
    public href = '';

    constructor( private _elementRef : ElementRef ) {
        super();
    }

    ngOnInit(): void {
        this.data = this.node.attrs.data;

        this.editor.on('update', () => {
            this._elementRef.nativeElement.style.textAlign = this.node.attrs.textAlign;
            this.href = this.node.attrs.href;
        });
    }

}
