import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';

// Editor
import { EditorState } from 'prosemirror-state';
import tippy, { Instance } from 'tippy.js';
import { Editor, isTextSelection, posToDOMRect } from '@tiptap/core';

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
    public tippy: Instance;

    ngOnInit(): void {
        this.editor.on('selectionUpdate', () => {
            this.shouldShowTippy(this.editor.state);
            this.setTippyPosition();
        });
        this.editor.on('focus', () => {
            this.removeHighlight();
            this.hideForm();
        });
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
        this.tippy.show();
    }

    addLink(newLink: string) {
        if (!newLink) {
            return;
        }
        this.editor.commands.setLink({ href: newLink });
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

    focusInput(event: MouseEvent) {
        this.input.nativeElement.focus();
        event.preventDefault();
    }

    toggleTippy() {
        if (this.tippy.state.isShown) {
            this.hideForm();
        } else {
            this.showForm();
        }
    }


    hideForm() {
        this.tippy.hide();
        this.formContainer.nativeElement.style.visibility = 'hidden';
        this.editor.view.focus();
    }

    private showForm() {
        this.isLink();
        this.tippy.show();
        this.formContainer.nativeElement.style.visibility = 'visible';
        // tippy.show() has a delay before mounting the element
        setTimeout(() => this.input.nativeElement.focus(), 0);
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

    private shouldShowTippy(state: EditorState): void {
        const { doc, selection } = state;
        const { empty } = selection;

        const isEmptyTextBlock =
            !doc.textBetween(selection.from, selection.to).length &&
            isTextSelection(state.selection);

        if (empty || isEmptyTextBlock) {
            this.tippy.hide();
        }
    }
}
