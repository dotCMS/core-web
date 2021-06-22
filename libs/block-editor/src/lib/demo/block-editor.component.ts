import {
    Component,
    ComponentFactoryResolver,
    Injector,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { ActionsMenu } from '../extentions/actions-menu.extension';
import { ContentletBlock } from '../extentions/contentlet-block.extension';

@Component({
    selector: 'dotcms-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BlockEditorComponent implements OnInit {
    editor: Editor;

    value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(private injector: Injector, private resolver: ComponentFactoryResolver) {}

    ngOnInit() {
        const el = document.createElement('button');
        el.innerText = 'Action';
        this.editor = new Editor({
            extensions: [
                StarterKit,
                ContentletBlock(this.injector, this.resolver),
                ActionsMenu(this.injector, this.resolver)
            ]
        });
    }
}
