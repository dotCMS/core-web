import {
    Component,
    ComponentFactoryResolver,
    Injector,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Editor, posToDOMRect } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { ActionsMenu } from '../extensions/actions-menu.extension';
import { ContentletBlock } from '../extensions/blocks/contentlet-block/contentlet-block.extension';
import { DragHandler } from '../extensions/dragHandler.extention';

import { ImageUpload } from '../extensions/imageUpload.extention';
import { ImageBlock } from '../extensions/blocks/image-block/image-block.extention';

// Marks Extensions
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';

import { BubbleMenuLinkFormComponent } from '../extensions/components/bubble-menu-link-form/bubble-menu-link-form.component';

import tippy, { Instance } from 'tippy.js';
import { ComponentRef } from '@angular/core';
@Component({
    selector: 'dotcms-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BlockEditorComponent implements OnInit {

    editor: Editor;
    tippy: Instance;
    bubbleMenuTippyOption = {
        duration: 500,
        maxWidth: 'none',
        placement: 'top-start',
        trigger: 'manual'
    }
    componentLinkForm: ComponentRef<BubbleMenuLinkFormComponent>;

    value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(private injector: Injector, private resolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                ContentletBlock(this.injector),
                ImageBlock(this.injector),
                ActionsMenu(this.injector, this.resolver),
                DragHandler(this.injector, this.resolver),
                ImageUpload(this.injector, this.resolver),
                // Marks Extensions
                Underline,
                TextAlign.configure({ types: ['heading', 'paragraph', 'listItem'] }),
                Highlight.configure({ HTMLAttributes: { class: 'highlighted'} }),
                Link.configure({ openOnClick: true })
            ]
        });

        this.editor.on('focus', () => {
            if(this.tippy?.state.isShown) {
                this.hideLinkForm();
            }
        })
    }

    createTippy() {
        this.tippy = tippy(this.editor.view.dom, {
            duration: 150,
            getReferenceClientRect: null,
            content: this.componentLinkForm.location.nativeElement,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom',
            hideOnClick: 'toggle',
            animation: 'fade'
        });
    }

    initLinkFormComponent(injector: Injector, resolver: ComponentFactoryResolver): ComponentRef<BubbleMenuLinkFormComponent> {
        const factory = resolver.resolveComponentFactory(BubbleMenuLinkFormComponent);
        const component = factory.create(injector);

        // Attach Events
        component.instance.hideForm.subscribe(() => this.hideLinkForm());
        component.instance.removeLink.subscribe(() => this.removeLink());
        component.instance.setLink.subscribe((event) => this.setLink(event));
        component.instance.toggleHighlight.subscribe((event) => this.toggleHighlight(event));
        
        component.changeDetectorRef.detectChanges();
        return component;
    }

    toggleLinkForm() {

        if(!this.componentLinkForm) {
            this.componentLinkForm = this.initLinkFormComponent(this.injector, this.resolver);
            this.createTippy();
        }

        if( this.tippy.state.isShown ) {
            this.hideLinkForm();
        } else {
            this.tippy.show();
            this.setTippyPosition();
            this.setInputLink();
            this.focusInputLink();
        }
        this.detectLinkFormChanges();
    }

    hideLinkForm() {
        this.editor.view.focus();
        this.tippy.hide();
        this.toggleHighlight(false);
    }

    setTippyPosition() {
        const { view } = this.editor;
        const { selection } = this.editor.state;
        this.tippy.setProps({
            getReferenceClientRect: () => posToDOMRect(view, selection.from, selection.to)
        });
    }

    setLink( link: string ) {
        if( link ) {
            this.editor.commands.setLink({ href: link });
        }
        this.hideLinkForm();
    }

    removeLink() {
        this.editor.commands.unsetLink();
        this.hideLinkForm();        
    }

    toggleHighlight( add: boolean ) {
        if ( add ) {
            this.editor.commands.setHighlight();
        } else {
            this.editor.commands.unsetHighlight();
        }
    }

    setInputLink() {
        this.componentLinkForm.instance.nodeLink = this.getNodeLink();
        this.componentLinkForm.instance.newLink = this.getNodeLink();
    }

    detectLinkFormChanges() {
        this.componentLinkForm.changeDetectorRef.detectChanges();
    }

    focusInputLink() {
        this.componentLinkForm.instance.focusInput();
    }

    private getNodeLink(): string {
        return this.editor.isActive('link')
            ? this.editor.getAttributes('link').href
            : '';
    }
}
