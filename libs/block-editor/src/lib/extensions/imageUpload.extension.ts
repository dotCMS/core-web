import { Image } from '@tiptap/extension-image';
import { Plugin } from 'prosemirror-state';

// export const ImageUploadExtension = Image.extend({});

export default class ImageUploadExtension extends Image {

    uploader;

    constructor(options: {uploader: any}) {
        super(options);
        this.uploader = options.uploader;
    }

    get name() {
        return 'image';
    }

    get plugins() {
        const uploader = this.uploader;
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        paste(view, event) {
                            console.log('paste');
                            return true;
                        },
                        drop (view, event) {
                            console.log('drop');
                            return true;
                        }
                    }
                }
            })
    }
}
