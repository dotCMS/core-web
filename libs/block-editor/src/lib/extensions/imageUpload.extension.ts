import { Plugin, PluginKey } from 'prosemirror-state';
import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { Extension, getNodeType } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';
import { EditorView } from 'prosemirror-view';
import { LoaderComponent, MessageType } from './components/loader/loader.component';
import { PlaceholderPlugin } from '../plugins/placeholder.plugin';
import { take } from 'rxjs/operators';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

export const ImageUpload = (injector: Injector, viewContainerRef: ViewContainerRef) => {
    return Extension.create({
        name: 'imageUpload',

        addProseMirrorPlugins() {
            const dotImageService = injector.get(DotImageService);

            function areImageFiles(event: ClipboardEvent | DragEvent): boolean {
                let files: FileList;
                if (event.type === 'drop') {
                    files = (event as DragEvent).dataTransfer.files;
                } else {
                    //paste
                    files = (event as ClipboardEvent).clipboardData.files;
                }
                console.log(files);
                if (files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        if (!files[i].type.startsWith('image/')) {
                            return false;
                        }
                    }
                }

                return !!files.length;
            }

            function setPlaceHolder(view: EditorView, position: number, id: string) {
                const loadingBlock: ComponentRef<LoaderComponent> =
                    viewContainerRef.createComponent(LoaderComponent);
                const tr = view.state.tr;
                loadingBlock.instance.data = {
                    message: 'Uploading...',
                    type: MessageType.INFO
                };
                loadingBlock.changeDetectorRef.detectChanges();

                tr.setMeta(PlaceholderPlugin, {
                    add: {
                        id: id,
                        pos: position,
                        element: loadingBlock.location.nativeElement
                    }
                });

                view.dispatch(tr);
            }

            function externalImage(clipboardData: any) {
                const html = clipboardData.getData('text/html') || '';
                const parsed = new DOMParser().parseFromString(html, 'text/html');
                const img = parsed.querySelector('img');
                if (!img) {
                    return false;
                }
                return true;
            }

            function uploadImages(view: EditorView, files: File[], position: number) {
                const { schema } = view.state;

                setPlaceHolder(view, position, files[0].name);

                dotImageService
                    .publishContent(files)
                    .pipe(take(1))
                    .subscribe(
                        (dotAssets: DotCMSContentlet[]) => {
                            const tr = view.state.tr;
                            const data = dotAssets[0][Object.keys(dotAssets[0])[0]];
                            const imageNode = getNodeType('dotImage', schema).create({
                                data: data
                            });
                            view.dispatch(
                                tr
                                    .replaceRangeWith(position, position, imageNode)
                                    .setMeta(PlaceholderPlugin, {
                                        remove: { id: data.name }
                                    })
                            );
                        },
                        (error) => {
                            alert(error.message);
                            view.dispatch(
                                view.state.tr.setMeta(PlaceholderPlugin, {
                                    remove: { id: files[0].name }
                                })
                            );
                        }
                    );
            }

            /**
             * Get position from cursor current position when pasting an image
             *
             * @param {EditorView} view
             * @return {*}  {{ from: number; to: number }}
             */
            function getPositionFromCursor(view: EditorView): { from: number; to: number } {
                const { state } = view;
                const { selection } = state;
                const { ranges } = selection;
                const from = Math.min(...ranges.map((range) => range.$from.pos));
                const to = Math.max(...ranges.map((range) => range.$to.pos));
                return { from, to };
            }

            return [
                PlaceholderPlugin,
                new Plugin({
                    key: new PluginKey('imageUpload'),
                    props: {
                        handleDOMEvents: {
                            paste(view, event) {
                                if (areImageFiles(event) && !externalImage(event.clipboardData)) {
                                    if (event.clipboardData.files.length !== 1) {
                                        alert('Can paste just one image at a time');
                                        return false;
                                    }
                                    const { from } = getPositionFromCursor(view);
                                    const files = Array.from(event.clipboardData.files);
                                    uploadImages(view, files, from);
                                }

                                return false;
                            },

                            drop(view, event) {
                                if (areImageFiles(event)) {
                                    event.preventDefault();
                                    if (event.dataTransfer.files.length !== 1) {
                                        alert('Can drop just one image at a time');
                                        return false;
                                    }
                                    const { pos: position } = view.posAtCoords({
                                        left: event.clientX,
                                        top: event.clientY
                                    });

                                    const files = Array.from(event.dataTransfer.files);
                                    uploadImages(view, files, position);
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
