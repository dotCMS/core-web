import { Element, Prop } from '@stencil/core';

import { DotCMSTempFile } from '../../models';

@Comment({
    tag: 'dot-binary-file-preview',
    styleUrl: 'dot-binary-file-preview.scss'
})
export class DotBinaryFieldPreviewComponent {
    @Element() el: HTMLElement;

    /** file to be displayed */
    @Prop({ reflectToAttr: true })
    file: DotCMSTempFile = null;

    /** (optional) Delete button's label */
    @Prop({ reflectToAttr: true })
    deleteLabel = 'Delete';

    render() {
        return (
            <Fragment>
                <div>{this.getPreviewElement()}</div>
                <div>
                    <span>{this.file.fileName}</span>
                    <button>{this.deleteLabel}</button>
                </div>
            </Fragment>
        );
    }

    private getPreviewElement(): JSX.Element {
        return this.file ? (
            this.file.image ? (
                <img src={this.file.thumbnailUrl} />
            ) : (
                <div class="file-preview"><span>{this.getExtention()}</span></div>
            )
        ) : null;
    }

    private getExtention(): string {
        return this.file.fileName.substr(this.file.fileName.indexOf('.'));
    }
}
