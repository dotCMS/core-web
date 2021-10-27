import { ComponentFactoryResolver, Injector } from '@angular/core';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DotCMSContentlet, DotCMSTempFile } from '@dotcms/dotcms-models';
import { DotHttpErrorResponse } from '../../../../dotcms-webcomponents/src/models/dot-http-error-response.model';
import { DotUploadService } from '../services/dot-upload/dot-upload.service';
import { DotAssetService } from '../services/dot-asset/dot-asset.service';
import { EditorView } from 'prosemirror-view';

export const DragAndDropHandlerExtention = (
    injector: Injector,
    resolver: ComponentFactoryResolver
) => {
    return Extension.create({
        name: 'dragAndDropHandler',

        addProseMirrorPlugins() {
            function createDotAsset(view: EditorView, files: DotCMSTempFile[]) {
                debugger;
                const assetService = new DotAssetService();
                // this.updateProgressBar(0, `${this.createAssetsText} 0/${files.length}`);
                return assetService
                    .create({
                        files: files,
                        updateCallback: (filesCreated: number) => {
                            console.log('filesCreated');
                            // this.updateDotAssetProgress(files.length, filesCreated);
                        },
                        url: 'http://localhost:8080/api/v1/workflow/actions/default/fire/PUBLISH',
                        folder: ''
                    })
                    .then((response: DotCMSContentlet[]) => {
                        debugger;
                        const { schema } = view.state;
                        const node = schema.nodes.image.create({
                            src: 'http://localhost:8080/' + (response[0] as any).asset
                        });
                        const transaction = view.state.tr.replaceSelectionWith(node);
                        view.dispatch(transaction);

                        // this.hideOverlay();
                        // this.uploadComplete.emit(response);
                        //TODO: show image image in the Editor.
                    })
                    .catch((errors: DotHttpErrorResponse[]) => {
                        // this.showDialog(
                        //     this.dialogLabels.dotAssetErrorHeader
                        //         .replace('$0', errors.length.toString())
                        //         .replace('$1', files.length.toString()),
                        //     this.formatErrorMessage(errors)
                        // );
                        // this.uploadComplete.emit(errors);
                        console.log('error');
                    })
                    .finally(() => {
                        // this.updateProgressBar(0, this.uploadFileText);
                    });
            }

            function uploadTemFiles(view: EditorView, event: DragEvent) {
                const uploadService = new DotUploadService();
                let files: File[] = [];
                // this.updateProgressBar(0, this.uploadFileText);
                if (event.dataTransfer.items) {
                    for (let item of Array.from(event.dataTransfer.items)) {
                        try {
                            if (item.webkitGetAsEntry().isFile) {
                                files.push(item.getAsFile());
                            } else {
                                this.showDialog(
                                    this.dialogLabels.errorHeader,
                                    this.uploadErrorLabel
                                );
                                files = [];
                                break;
                            }
                        } catch {
                            //    this.showDialog(this.dialogLabels.errorHeader, this.uploadErrorLabel);
                            files = [];
                        }
                    }
                } else {
                    Array.from(event.dataTransfer.files).map((file: File) => {
                        files.push(file);
                    });
                }
                if (files.length) {
                    uploadService
                        .uploadBinaryFile(files)
                        .then((data: DotCMSTempFile | DotCMSTempFile[]) => {
                            debugger;
                            createDotAsset(view, Array.isArray(data) ? data : [data]);
                        })
                        .catch(({ message }: DotHttpErrorResponse) => {
                            console.log('error message');

                            // this.showDialog(
                            //     this.dialogLabels ? this.dialogLabels.uploadErrorHeader : '',
                            //     this.isMaxsizeError(message) ? (
                            //         <span>{this.multiMaxSizeErrorLabel}</span>
                            //     ) : (
                            //         <span>{message}</span>
                            //     )
                            // );
                        })
                        .finally(() => {
                            // this.updateProgressBar(0, '');
                        });
                }
            }

            function areImageFiles(files: FileList): boolean {
                debugger;
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].type.startsWith('image/')) {
                        return false;
                    }
                }
                return true;
            }

            return [
                new Plugin({
                    key: new PluginKey('dragAndDropHandler'),
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
                                    console.log('paste');
                                }
                                return false;
                            },
                            dragover(view, event) {
                                // event.preventDefault();
                                return true;
                            },
                            drop(view, event) {
                                // event.preventDefault();
                                // debugger;
                                console.log('drop drag & drop');
                                if (
                                    !!event.dataTransfer.files.length &&
                                    areImageFiles(event.dataTransfer.files)
                                ) {
                                    uploadTemFiles(view, event);
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
