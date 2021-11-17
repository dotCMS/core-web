import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';

// Editor
import tippy, { Instance } from 'tippy.js';
import { Editor, posToDOMRect } from '@tiptap/core';

@Component({
    selector: 'dotcms-bubble-menu-link-form',
    templateUrl: './bubble-menu-link-form.component.html',
    styleUrls: ['./bubble-menu-link-form.component.scss']
})
export class BubbleMenuLinkFormComponent implements OnInit, AfterViewInit {

    @ViewChild('form') form: ElementRef;
    @ViewChild('input') input: ElementRef;
    @ViewChild('formContainer') formContainer: ElementRef;
    
    @Input() editor: Editor;

    public nodeLink = '';
    public newLink = '';
    public tippy: Instance;

    ngOnInit(): void {
        this.editor.on('selectionUpdate', () => this.setTippyPosition());
    }

    ngAfterViewInit() {
        this.tippy = tippy(this.formContainer.nativeElement as HTMLElement, {
            duration: 150,
            getReferenceClientRect: null,
            content: this.form.nativeElement,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom',
            hideOnClick: 'toggle',
            animation: 'fade',
            appendTo: this.formContainer.nativeElement
        });
    }

    addLink() {
        if (!this.newLink) {
            return;
        }
        this.editor.commands.setLink({ href: this.newLink });
        this.editor.commands.unsetHighlight();
        this.hideForm();
    }

    copyLink() {
        navigator.clipboard
            .writeText(this.nodeLink)
            .then(() => this.hideForm())
            .catch(() => alert('Could not copy link'));
    }

    removeLink() {
        this.editor.commands.unsetLink();
        this.hideForm();
    }

    addHighlight() {
        this.editor.commands.setHighlight();
    }

    removeHighlight() {
        if (this.editor.isFocused) {
            this.editor.commands.unsetHighlight();
        }
    }

    showForm() {
        this.newLink = '';
        this.isLink();
        this.tippy.show();
        this.formContainer.nativeElement.style.visibility = 'visible';
        // tippy.show() has a delay before mounting the element
        setTimeout(() => this.input.nativeElement.focus(), 0);
    }

    hideForm() {
        this.tippy.hide();
        this.formContainer.nativeElement.style.visibility = 'hidden';
        this.editor.view.focus();
        this.removeHighlight();
    }

    focusInput() {
        this.input.nativeElement.focus();
    }

    preventHideOnFormClick( event: MouseEvent ) {
        event.stopPropagation();
    }

    private isLink() {
        this.nodeLink = this.editor.isActive('link')
            ? this.editor.getAttributes('link').href
            : '';
    }

    private setTippyPosition() {
        if (this.tippy) {
            const { view } = this.editor;
            const { selection } = this.editor.state;
            this.tippy.setProps({
                getReferenceClientRect: () => posToDOMRect(view, selection.from, selection.to)
            });
        }
    }
}
