import {
    Component,
    ComponentFactoryResolver,
    Injector,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { ActionsMenu } from '../extensions/actions-menu.extension';
import { ContentletBlock } from '../extensions/blocks/contentlet-block/contentlet-block.extension';
import { DragHandler } from '../extensions/dragHandler.extention';
import { BubbleMenu } from '../extensions/bubble-menu.extension';

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
        this.editor = new Editor({
            extensions: [
                StarterKit,
                ContentletBlock(this.injector),
                ActionsMenu(this.injector, this.resolver),
                DragHandler(this.injector, this.resolver),
                BubbleMenu(this.injector, this.resolver)
            ]
        });
    }
}
