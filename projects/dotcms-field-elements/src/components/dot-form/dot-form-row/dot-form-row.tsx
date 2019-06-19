import { Component, Prop } from '@stencil/core';
import { DotCMSFieldRow, DotCMSFieldColumn } from '../models';

@Component({
    tag: 'dot-form-row',
    styleUrl: 'dot-form-row.scss'
})
export class DotFormRowComponent {
    @Prop({ mutable: true, reflectToAttr: true }) fields: DotCMSFieldRow[] = [];
    @Prop() fieldsToShow: string[] = [];

    render() {
        return this.fields.map((row: DotCMSFieldRow) => {
            return (
                <div class="dot-form__row">
                    {row.columns.map((fieldColumn: DotCMSFieldColumn) => {
                        return (
                            <dot-form-column
                                column={fieldColumn}
                                fields-to-show={this.fieldsToShow}
                            />
                        );
                    })}
                </div>
            );
        });
    }
}
