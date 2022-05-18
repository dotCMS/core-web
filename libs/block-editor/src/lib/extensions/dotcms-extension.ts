import { Extension } from '@tiptap/core';
import { Injector, ViewContainerRef } from '@angular/core';
import { ContentletBlock, DragHandler, ImageBlock } from '@dotcms/block-editor';

export interface DotcmsExtensionOptions {
    dotContent: Injector | false;
    dotImage: Injector | false;
    dragHandler: ViewContainerRef | false;
}

export const DotcmsExtension = Extension.create<DotcmsExtensionOptions>({
    name: 'dotCMSEstension',
    addExtensions() {
        const extensions = [];

        if (this.options.dotContent !== false) {
            extensions.push(ContentletBlock(this.options.dotContent));
        }

        if (this.options.dotImage !== false) {
            extensions.push(ImageBlock(this.options.dotImage));
        }

        if (this.options.dragHandler !== false) {
            extensions.push(DragHandler(this.options.dragHandler));
        }

        return extensions;
    }
});
