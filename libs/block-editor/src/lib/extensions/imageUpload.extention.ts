import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state';
import { Injector } from '@angular/core';
import { Extension } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';
import { EditorView } from 'prosemirror-view';

export const ImageUploadExtension = (injector: Injector) => {
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
                return !!files.length;
            }

            function loadingPlaceHolder(view: EditorView, position = 0) {
                const { schema } = view.state;
                const dotMessage = schema.nodes.dotMessage.create({
                    data: { message: 'Uploading...', type: 0 }
                });
                const transaction = view.state.tr.insert(position, dotMessage);
                debugger;
                view.dispatch(transaction);
                // view.dispatch(
                //     view.state.tr.setSelection(NodeSelection.create(view.state.doc, position))
                // );
                // view.dispatch(
                //     view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
                // );
            }

            function uploadImages(view: EditorView, files, position = 0) {
                const { schema } = view.state;
                loadingPlaceHolder(view, position);
                dotImageService
                    .get(files)
                    .pipe()
                    .subscribe(
                        (dotAsset) => {
                            const imageNode = schema.nodes.dotImage.create({ data: dotAsset });
                            view.dispatch(view.state.tr.insert(position + 1, imageNode));
                        },
                        (error) => {
                            //TODO: Display Error.
                            alert(error.message);
                            view.dispatch(view.state.tr.replaceWith(position, position + 1, null));
                        },
                        () => {
                            console.log('complete');

                            //  view.dispatch(view.state.tr.deleteSelection());
                            view.dispatch(view.state.tr.replaceWith(position, position + 1, null));
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
                                    !!event.clipboardData.files.length &&
                                    areImageFiles(event.clipboardData.files)
                                ) {
                                    event.preventDefault();
                                    debugger;
                                    uploadImages(
                                        view,
                                        Array.from(event.clipboardData.files),
                                        view.state.selection.to
                                    );
                                }
                                return false;
                            },

                            drop(view, event) {
                                if (
                                    !!event.dataTransfer.files.length &&
                                    areImageFiles(event.dataTransfer.files)
                                ) {
                                    event.preventDefault();

                                    const position = view.posAtCoords({
                                        left: event.clientX,
                                        top: event.clientY
                                    });
                                    uploadImages(
                                        view,
                                        Array.from(event.dataTransfer.files),
                                        position.pos
                                    );
                                }
                                return false;
                            }
                        }
                    }
                })
            ];
        }
    });
};
