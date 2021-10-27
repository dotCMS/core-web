import { Plugin, PluginKey } from 'prosemirror-state';
import { ComponentFactoryResolver, Injector } from '@angular/core';
import { Extension } from '@tiptap/core';
import { DotImageService } from './services/dot-image/dot-image.service';

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
                                    console.log('paste');
                                }
                                return false;
                            },

                            drop(view, event) {
                                console.log('drop ImageUploadExtension');
                                if (
                                    !!event.dataTransfer.files.length &&
                                    areImageFiles(event.dataTransfer.files)
                                ) {
                                    event.preventDefault();
                                    let files: File[] = [];
                                    // this.updateProgressBar(0, this.uploadFileText);
                                    if (event.dataTransfer.items) {
                                        for (let item of Array.from(event.dataTransfer.items)) {
                                            try {
                                                if (item.webkitGetAsEntry().isFile) {
                                                    files.push(item.getAsFile());
                                                } else {
                                                    // this.showDialog(
                                                    //     this.dialogLabels.errorHeader,
                                                    //     this.uploadErrorLabel
                                                    // );
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
                                        dotImageService.get(files).subscribe((data) => {
                                            const { schema } = view.state;
                                            console.log(schema);
                                            debugger;
                                            const node = schema.nodes.image.create({
                                                src: 'http://localhost:8080/' + data.asset
                                            });
                                            const transaction = view.state.tr.replaceSelectionWith(
                                                node
                                            );
                                            view.dispatch(transaction);
                                        });
                                    }
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

// export default class ImageUploadExtension extends Image {
//
//     uploader;
//
//     constructor(options: {uploader: any}) {
//         super(options);
//         this.uploader = options.uploader;
//     }
//
//     get name() {
//         return 'image';
//     }
//
//     get plugins() {
//         const uploader = this.uploader;
//         return [
//             new Plugin({
//                 props: {
//                     handleDOMEvents: {
//                         paste(view, event) {
//                             console.log('paste');
//                             return true;
//                         },
//                         drop (view, event) {
//                             console.log('drop');
//                             return true;
//                         }
//                     }
//                 }
//             })
//     }
// }
