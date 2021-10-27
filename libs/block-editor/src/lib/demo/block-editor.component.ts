import {
    Component,
    ComponentFactoryResolver,
    Injector,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import { ActionsMenu } from '../extensions/actions-menu.extension';
import { ContentletBlock } from '../extensions/blocks/contentlet-block/contentlet-block.extension';
import { DragHandler } from '../extensions/dragHandler.extention';
import { DragAndDropHandlerExtention } from '../extensions/dragAndDropHandler.extention';
import ImageUploadExtension from '../extensions/imageUpload.extension';
import { EditorView } from 'prosemirror-view';
import { DotCMSContentlet, DotCMSTempFile } from '@dotcms/dotcms-models';
import { DotAssetService } from '../services/dot-asset/dot-asset.service';
import { DotHttpErrorResponse } from '../../../../dotcms-webcomponents/src/models/dot-http-error-response.model';
import { DotUploadService } from '../services/dot-upload/dot-upload.service';

@Component({
    selector: 'dotcms-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BlockEditorComponent implements OnInit {
    editor: Editor;

    value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor(private injector: Injector, private resolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                Image,
                ContentletBlock(this.injector),
                ActionsMenu(this.injector, this.resolver),
                DragHandler(this.injector, this.resolver),
                DragAndDropHandlerExtention(this.injector, this.resolver),
                new ImageUploadExtension({
                    uploader: (image) => {
                        return true;

                        this.uploadTemFiles.toPromise().then((data) => {});
                        createDotAsset(view, Array.isArray(data) ? data : [data]);
                    }
                })
            ]
        });
    }

    createDotAsset(view: EditorView, files: DotCMSTempFile[]) {
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

    uploadTemFiles(view: EditorView, event: DragEvent) {
        const uploadService = new DotUploadService();
        let files: File[] = [];
        // this.updateProgressBar(0, this.uploadFileText);
        if (event.dataTransfer.items) {
            for (let item of Array.from(event.dataTransfer.items)) {
                try {
                    if (item.webkitGetAsEntry().isFile) {
                        files.push(item.getAsFile());
                    } else {
                        // this.showDialog(this.dialogLabels.errorHeader, this.uploadErrorLabel);
                        files = [];
                        break;
                    }
                } catch {
                    //  this.showDialog(this.dialogLabels.errorHeader, this.uploadErrorLabel);
                    files = [];
                }
            }
        } else {
            Array.from(event.dataTransfer.files).map((file: File) => {
                files.push(file);
            });
        }
        if (files.length) {
            return uploadService.uploadBinaryFile(files);
            // .then((data: DotCMSTempFile | DotCMSTempFile[]) => {
            //     debugger;
            //     createDotAsset(view, Array.isArray(data) ? data : [data]);
            // })
            // .catch(({ message }: DotHttpErrorResponse) => {
            //     console.log('error message');
            //
            //     // this.showDialog(
            //     //     this.dialogLabels ? this.dialogLabels.uploadErrorHeader : '',
            //     //     this.isMaxsizeError(message) ? (
            //     //         <span>{this.multiMaxSizeErrorLabel}</span>
            //     //     ) : (
            //     //         <span>{message}</span>
            //     //     )
            //     // );
            // })
            // .finally(() => {
            //     // this.updateProgressBar(0, '');
            // });
        }
    }
}
