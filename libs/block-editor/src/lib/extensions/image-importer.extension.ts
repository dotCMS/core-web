import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Injector, ViewContainerRef, ComponentRef } from '@angular/core';
import { Extension, Editor, isNodeSelection, posToDOMRect, getNodeType } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';
import { take } from 'rxjs/operators';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { ImageImporterComponent } from './components/image-importer/image-importer.component';

import tippy, { Instance, Props } from 'tippy.js';
import { EditorView } from 'prosemirror-view';

export const ImageImporter = (injector: Injector, viewContainerRef: ViewContainerRef) => {
    return Extension.create({
        name: 'imageImporter',

        addProseMirrorPlugins() {
            const dotImageService = injector.get(DotImageService);
            const component = viewContainerRef.createComponent(ImageImporterComponent);

            function importImage(view: EditorView, url: string, position: number) {
                const { schema } = view.state;
                dotImageService
                    .publishContent(url)
                    .pipe(take(1))
                    .subscribe(
                        (dotAssets: DotCMSContentlet[]) => {
                            const tr = view.state.tr;
                            const data = dotAssets[0][Object.keys(dotAssets[0])[0]];
                            const imageNode = getNodeType('dotImage', schema).create({
                                data: data
                            });
                            view.dispatch(tr.replaceRangeWith(position, position, imageNode));
                        },
                        (error) => {
                            alert(error.message);
                        }
                    );
            }

            return [
                ImageImporterPlugin({
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: component.location.nativeElement,
                    tippyOptions: this.options.tippyOptions,
                    component: component,
                    importImage
                })
            ];
        }
    });
};

// PLUGIN
export class ImageImporterView {
    public editor: Editor;

    public element: HTMLElement;

    public view: EditorView;

    public tippy: Instance | undefined;

    public tippyOptions?: Partial<Props>;

    public pluginKey: PluginKey;

    public component?: ComponentRef<ImageImporterComponent>;

    private node: any;

    private from: number;

    public importImage: (
        view: EditorView,
        url: string,
        position: number
    ) => {
        /* */
    };

    constructor({ editor, element, view, tippyOptions = {}, pluginKey, component, importImage }) {
        this.editor = editor;
        this.element = element;
        this.view = view;

        this.tippyOptions = tippyOptions;
        this.importImage = importImage;
        // Detaches menu content from its current parent
        this.element.remove();
        this.pluginKey = pluginKey;
        this.component = component;
        requestAnimationFrame(() => this.createTooltip());

        this.component.instance.importImage.subscribe(() => {
            const { src } = this.node.attrs;
            const to = this.from + this.node.nodeSize;
            this.editor.commands.deleteRange({ from: this.from, to });
            this.importImage(this.view, src, this.from);
        });

        // We need to also react to page scrolling.
        document.body.addEventListener('scroll', this.hanlderScroll.bind(this), true);
    }

    update(view: EditorView, oldState?: EditorState): void {
        const { state, composing } = view;
        const { doc, selection } = state;
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

        if (composing || isSame) {
            return;
        }

        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));

        this.from = from;

        this.node = isNodeSelection(selection) ? doc.nodeAt(from) : null;

        if (this.node?.type.name != 'image') {
            this.hide();
            return;
        }

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
            interactive: true
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
        this.component.instance.importImage.unsubscribe();
    }

    hanlderScroll() {
        if (this.tippy?.state.isVisible) {
            this.tippy?.hide();
        }
    }
}

export const ImageImporterPlugin = (options) => {
    return new Plugin({
        key: options.pluginKey as PluginKey,
        view: (view) => new ImageImporterView({ view, ...options })
    });
};
