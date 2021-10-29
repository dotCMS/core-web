import { Plugin, PluginKey } from 'prosemirror-state';
import { ComponentFactoryResolver, Injector } from '@angular/core';
import { Extension } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';
import { EditorView } from 'prosemirror-view';

export const ImageUploadExtension = (injector: Injector, resolver: ComponentFactoryResolver) => {
    return Extension.create({
        name: 'imageUpload',

        addProseMirrorPlugins() {
            const dotImageService = injector.get(DotImageService);

            function areImageFiles(files: FileList): boolean {
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].type.startsWith('image/')) {
                        return false;
                    }
                }
                return true;
            }

            function loadingPlaceHolder(view: EditorView) {
                const { schema } = view.state;
                let text = schema.text('Uploading...');
                let uploadingNode = schema.nodes.paragraph.create(
                    { class: 'uploading-image' },
                    text
                );
                const transaction = view.state.tr.replaceSelectionWith(uploadingNode);
                view.dispatch(transaction);
            }

            function uploadImages(view: EditorView, files) {
                const { schema } = view.state;
                loadingPlaceHolder(view);
                dotImageService
                    .get(files)
                    .pipe()
                    .subscribe(
                        (data) => {
                            const node = schema.nodes.image.create({
                                src: 'http://localhost:8080/' + data.asset
                            });
                            const transaction = view.state.tr.insert(view.state.selection.to, node);
                            view.dispatch(transaction);
                        },
                        (error) => {
                            //TODO: Display Error.
                            alert(error.message);
                        }
                    );
            }

            return [
                new Plugin({
                    key: new PluginKey('imageUpload'),
                    view: (editorView) => {
                        return {};
                    },
                    props: {
                        handleDOMEvents: {
                            paste(view, event) {
                                if (
                                    event.clipboardData.files &&
                                    areImageFiles(event.clipboardData.files)
                                ) {
                                    event.preventDefault();
                                    debugger;
                                    uploadImages(view, Array.from(event.clipboardData.files));
                                    console.log('paste');
                                }
                                return true;
                            },

                            drop(view, event) {
                                console.log('drop ImageUploadExtension');
                                if (
                                    !!event.dataTransfer.files.length &&
                                    areImageFiles(event.dataTransfer.files)
                                ) {
                                    event.preventDefault();

                                    uploadImages(view, Array.from(event.dataTransfer.files));
                                }
                                return true;
                            }
                        }
                    }
                })
            ];
        }
    });
};
