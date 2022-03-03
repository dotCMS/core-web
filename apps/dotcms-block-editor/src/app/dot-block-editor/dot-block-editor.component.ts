import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    Injector,
    ViewEncapsulation,
    ViewContainerRef
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import {
    ActionsMenu,
    BubbleLinkFormExtension,
    ContentletBlock,
    DotBubbleMenuExtension,
    DragHandler,
    ImageBlock,
    ImageUpload,
    shouldShowBubbleMenu
} from '@dotcms/block-editor';

// Marks Extensions
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { BubbleMenuComponent } from '../../../../../libs/block-editor/src/lib/extensions/components/bubble-menu/bubble-menu.component';

@Component({
    selector: 'dotcms-block-editor',
    templateUrl: './dot-block-editor.component.html',
    styleUrls: ['./dot-block-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DotBlockEditorComponent implements OnInit {
    editor: Editor;

    value = ''; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(
        private viewContainerRef: ViewContainerRef,
        private injector: Injector,
        private resolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                ContentletBlock(this.injector),
                ImageBlock(this.injector),
                ActionsMenu(this.injector, this.resolver),
                DragHandler(this.injector, this.resolver),
                ImageUpload(this.injector, this.resolver),
                BubbleLinkFormExtension(this.injector, this.resolver),
                DotBubbleMenuExtension(this.viewContainerRef),
                DotBubbleMenuExtension.configure({
                    element: BubbleMenuComponent,
                    shouldShow: shouldShowBubbleMenu,
                    tippyOptions: {
                        duration: 500,
                        maxWidth: 'none',
                        placement: 'top-start',
                        trigger: 'manual'
                    }
                }),
                // Marks Extensions
                Underline,
                TextAlign.configure({ types: ['heading', 'paragraph', 'listItem', 'dotImage'] }),
                Highlight.configure({ HTMLAttributes: { class: 'highlighted' } }),
                Link.configure({ openOnClick: true })
            ]
        });
    }
}
