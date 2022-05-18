import { Component, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit, { StarterKitOptions } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import {
    ActionsMenu,
    BubbleLinkFormExtension,
    DEFAULT_LANG_ID,
    DotBubbleMenuExtension,
    DotcmsExtension,
    DotcmsExtensionOptions,
    ImageUpload,
    stringListToArray
} from '@dotcms/block-editor';

// Marks Extensions
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Level } from '@tiptap/extension-heading/src/heading';

function toTitleCase(str) {
    return str.replace(/\p{L}+('\p{L}+)?/gu, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    });
}

type AvailableMarksOrBlocks =
    | 'text'
    | 'paragraph'
    | 'orderedList'
    | 'bulletList'
    | 'listItem'
    | 'horizontalRule'
    | 'codeBlock'
    | 'blockquote'
    | 'code'
    // Headings
    | 'h1'
    | 'h2'
    | 'h3';

type AvailablesHeadings = 'h1' | 'h2' | 'h3';

@Component({
    selector: 'dotcms-block-editor',
    templateUrl: './dot-block-editor.component.html',
    styleUrls: ['./dot-block-editor.component.scss']
})
export class DotBlockEditorComponent implements OnInit {
    @Input() lang = DEFAULT_LANG_ID;
    @Input() allowedblocks = '';
    @Input() allowedContentTypes = '';

    editor: Editor;

    value = ''; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(private injector: Injector, public viewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        this.loadEditor();
        console.info('OnInit');
    }

    // Config step
    // recibir dotConfig
    // remover starterKit, cargar solo los bloques(Nodes) allowedBlocks

    // When init the Block Editor
    // run blockEditor

    // set Content to the editor
    // setStore del Editor (Lang and allowedBlocks)
    // Detectar que nodos hay y no mostrar en los suggestions

    private loadEditor() {
        const starterKitOptions: Partial<StarterKitOptions> = this.getStarterKitConfig();
        const dotcmsExtensionOptions: DotcmsExtensionOptions = {
            dotContent: this.injector,
            // not optionals
            dotImage: this.injector,
            dragHandler: this.viewContainerRef
        };
        this.editor = new Editor({
            extensions: [
                StarterKit.configure(starterKitOptions),
                DotcmsExtension.configure(dotcmsExtensionOptions), // inside exist  ContentletBlock,ImageBlock, DragHandler

                //ContentletBlock(this.injector),
                //ImageBlock(this.injector),
                ActionsMenu(this.viewContainerRef),
                //DragHandler(this.viewContainerRef),
                ImageUpload(this.injector, this.viewContainerRef),
                BubbleLinkFormExtension(this.injector, this.viewContainerRef),
                DotBubbleMenuExtension(this.viewContainerRef),

                // Marks Extensions
                Underline,
                TextAlign.configure({ types: ['heading', 'paragraph', 'listItem', 'dotImage'] }),
                Highlight.configure({ HTMLAttributes: { style: 'background: #accef7;' } }),
                Link.configure({ openOnClick: true }),
                Placeholder.configure({
                    placeholder: ({ node }) => {
                        if (node.type.name === 'heading') {
                            return `${toTitleCase(node.type.name)} ${node.attrs.level}`;
                        }
                        return 'Type "/" for commmands';
                    }
                })
            ]
        });

        console.info('this.editor', this.editor);
        this.setEditorStorageData();
    }

    // Here we create the dotConfig name space
    // to storage information in the editor.
    private setEditorStorageData() {
        this.editor.storage.dotConfig = {
            lang: this.lang,
            allowedContentTypes: this.allowedContentTypes,
            allowedblocks: this.allowedblocks
        };
    }

    // Todo: pasar esto a otro lugar
    private getStarterKitConfig() {
        let defaultsStarterConfig: Partial<StarterKitOptions> = {
            // Blocks
            blockquote: false,
            heading: false,
            bulletList: false,
            codeBlock: false,
            listItem: false,
            orderedList: false,
            code: false,
            // paragraph: false <- it is the default block
            // text: false <- every block need an inside text node

            // Marks Extensions
            bold: false,
            italic: false,
            strike: false,
            hardBreak: false
        };
        const allowedBlocks = stringListToArray(this.allowedblocks);
        let starterConfig: Partial<StarterKitOptions>;

        // Heading Block
        const headingMapLevels: Record<'h1' | 'h2' | 'h3', Level> = { h1: 1, h2: 2, h3: 3 };
        let headingAllowedLevels: Level[] = [];

        allowedBlocks.forEach((blockOrMark: AvailableMarksOrBlocks) => {
            switch (blockOrMark) {
                case 'h1':
                case 'h2':
                case 'h3':
                    headingAllowedLevels = [...headingAllowedLevels, headingMapLevels[blockOrMark]];
                    break;
                case 'blockquote':
                    starterConfig = { ...starterConfig, blockquote: {} };
                    break;
                case 'bulletList':
                    starterConfig = { ...starterConfig, bulletList: {}, listItem: {} };
                    break;
                case 'orderedList':
                    starterConfig = { ...starterConfig, orderedList: {}, listItem: {} };
                    break;
            }
        });

        // Heading block has levels (H1, H2, H3)
        if (headingAllowedLevels.length) {
            starterConfig = { ...starterConfig, heading: { levels: headingAllowedLevels } };
        }

        return { ...defaultsStarterConfig, ...starterConfig };
    }
}
