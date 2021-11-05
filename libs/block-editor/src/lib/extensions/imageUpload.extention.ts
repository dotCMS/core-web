import { Plugin, PluginKey } from 'prosemirror-state';
import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { Extension } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';
import { EditorView } from 'prosemirror-view';
import { MessageComponent, MessageType } from './components/message/message.component';
import { PlaceholderPlugin } from '../plugins/placeholder.plugin';
import { take } from 'rxjs/operators';

export const ImageUploadExtension = (injector: Injector, resolver: ComponentFactoryResolver) => {
    return Extension.create({
        name: 'imageUpload',

        addProseMirrorPlugins() {
            const dotImageService = injector.get(DotImageService);
            const messageBlockFactory = resolver.resolveComponentFactory(MessageComponent);

            function areImageFiles(files: FileList): boolean {
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].type.startsWith('image/')) {
                        return false;
                    }
                }
                return !!files.length;
            }

            function findPlaceholder(state, id) {
                let decos = PlaceholderPlugin.getState(state);
                let found = decos.find(null, null, (spec) => spec.id == id);
                return found.length ? found[0].from : null;
            }

            function setPlaceHolder(view: EditorView, position: number, id: string) {
                const messageBlock: ComponentRef<MessageComponent> = messageBlockFactory.create(
                    injector
                );
                let tr = view.state.tr;
                messageBlock.instance.data = {
                    message: 'Uploading...',
                    type: MessageType.INFO
                };
                messageBlock.changeDetectorRef.detectChanges();

                if (!tr.selection.empty) {
                    tr.deleteSelection();
                }

                tr.setMeta(PlaceholderPlugin, {
                    add: {
                        id: id,
                        pos: position,
                        element: messageBlock.location.nativeElement
                    }
                });

                view.dispatch(tr);
            }

            function uploadImages(view: EditorView, files: File[], position = 0) {
                const { schema } = view.state;

                files.forEach((file) => {
                    setPlaceHolder(view, position, file.name);
                });

                dotImageService
                    .get(files)
                    .pipe(take(1))
                    .subscribe(
                        (dotAssets: []) => {
                            const tr = view.state.tr;
                            dotAssets.forEach((asset: any) => {
                                const data = asset[Object.keys(asset)[0]];
                                let pos = findPlaceholder(view.state, data.name);
                                debugger;
                                const imageNode = schema.nodes.dotImage.create({
                                    data: data
                                });
                                view.dispatch(
                                    tr.replaceWith(pos, pos, imageNode).setMeta(PlaceholderPlugin, {
                                        remove: { id: data.name }
                                    })
                                );
                            });
                        },
                        (error) => {
                            //TODO: Display Error.
                            alert(error.message);
                            view.dispatch(
                                view.state.tr.setMeta(PlaceholderPlugin, {
                                    remove: { id: 'placeholder' }
                                })
                            );
                        },
                        () => {
                            console.log('complete');
                        }
                    );
            }

            return [
                PlaceholderPlugin,
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
                                    if (event.clipboardData.files.length !== 1) {
                                        alert('Can paste just one image at a time');
                                        return false;
                                    }
                                    event.preventDefault();
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
                                    if (event.dataTransfer.files.length !== 1) {
                                        alert('Can drop just one image at a time');
                                        return false;
                                    }
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
