import { Extension, Editor, posToDOMRect, isNodeSelection } from '@tiptap/core';
import { PluginKey, Plugin, Transaction } from 'prosemirror-state';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { ImageFormComponent } from './components/image-form/image-form.component';

import tippy, { Instance, Props } from 'tippy.js';
import { EditorView } from 'prosemirror-view';

export const IMAGE_FORM_PLUGIN_KEY = new PluginKey('image-form');

export const ImageFormExtension = (viewContainerRef: ViewContainerRef) => {
    return Extension.create({
        name: 'bubbleLinkForm',
        defaultOptions: {
            element: null,
            tippyOptions: {},
            pluginKey: IMAGE_FORM_PLUGIN_KEY
        },

        addProseMirrorPlugins() {
            const component = viewContainerRef.createComponent(ImageFormComponent);
            component.changeDetectorRef.detectChanges();

            return [
                ImageFormPlugin({
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: component.location.nativeElement,
                    tippyOptions: this.options.tippyOptions,
                    component: component
                })
            ];
        }
    });
};

// PLUGIN
export class ImageFormView {
    public editor: Editor;

    public element: HTMLElement;

    public view: EditorView;

    public tippy: Instance | undefined;

    public tippyOptions?: Partial<Props>;

    public pluginKey: PluginKey;

    public component?: ComponentRef<ImageFormComponent>;

    constructor({ editor, element, view, tippyOptions = {}, pluginKey, component }) {
        this.editor = editor;
        this.element = element;
        this.view = view;

        this.tippyOptions = tippyOptions;

        // Detaches menu content from its current parent
        this.element.remove();
        this.pluginKey = pluginKey;
        this.component = component;
        requestAnimationFrame(() => this.createTooltip());

        this.component.instance.imageMeta.subscribe(this.insertImage.bind(this));

        // We need to also react to page scrolling.
        document.body.addEventListener('scroll', this.hanlderScroll.bind(this), true);
    }

    update(view: EditorView): void {
        const next = this.pluginKey.getState(view.state);

        console.log(!next.show);
        if (!next.show) {
            return;
        }
        console.log('LLAMADO?');
        const { state } = view;
        const { selection } = state;

        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));

        this.tippy?.setProps({
            getReferenceClientRect: () => {
                if (isNodeSelection(state.selection)) {
                    const node = view.nodeDOM(from) as HTMLElement;

                    if (node) {
                        return node.getBoundingClientRect();
                    }
                }

                return posToDOMRect(view, from, to);
            }
        });

        this.show();
    }

    createTooltip() {
        const { element: editorElement } = this.editor.options;
        const editorIsAttached = !!editorElement.parentElement;

        if (this.tippy || !editorIsAttached) {
            return;
        }

        this.tippy = tippy(document.body, {
            maxWidth: 'none',
            duration: 250,
            getReferenceClientRect: null,
            content: this.element,
            trigger: 'manual',
            placement: 'bottom-start',
            hideOnClick: true,
            interactive: true,
            onHidden: () => {
                this.handlerHide();
            }
        });
    }

    show() {
        this.tippy?.show();
    }

    hide() {
        this.tippy?.hide();
    }

    destroy() {
        this.tippy?.destroy();
        this.component.instance.imageMeta.unsubscribe();
    }

    handlerHide() {
        this.editor
            .chain()
            .command(({ tr }) => {
                tr.setMeta(this.pluginKey, { show: false });
                return true;
            })
            .run();
        this.cleanForm();
    }

    insertImage({ title, alt, src }) {
        this.editor.commands.setImage({
            src,
            alt,
            title
        });
        this.cleanForm();
        this.hide();
    }

    hanlderScroll() {
        if (this.tippy?.state.isVisible) {
            this.tippy?.hide();
        }
    }

    cleanForm() {
        this.component.instance.data = {
            title: '',
            alt: '',
            src: ''
        };
        this.component.changeDetectorRef.detectChanges();
    }
}

export const ImageFormPlugin = (options) => {
    return new Plugin({
        key: options.pluginKey as PluginKey,
        view: (view) => new ImageFormView({ view, ...options }),
        state: {
            init() {
                return {
                    show: false
                };
            },

            apply(transaction: Transaction, value) {
                const transactionMeta = transaction.getMeta(options.pluginKey);
                if (transactionMeta) {
                    return {
                        show: transactionMeta?.show
                    };
                }

                return value;
            }
        }
    });
};
