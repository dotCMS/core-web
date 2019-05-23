import { Component, Prop, Event, EventEmitter } from '@stencil/core';
import { DotKeyValueField } from '../../../models';

@Component({
    tag: 'key-value-table'
})
export class KeyValueTableComponent {
    @Prop() items: DotKeyValueField[] = [];
    @Prop({ reflectToAttr: true }) disabled = false;
    @Prop() buttonLabel = 'Delete';
    @Prop() emptyMessage = 'No values';

    @Event() delete: EventEmitter;

    render() {
        return (
            <table>
                <tbody>{this.renderRows(this.items)}</tbody>
            </table>
        );
    }

    private onDelete(index: number): void {
        this.delete.emit(index);
    }

    private getRow(item: DotKeyValueField, index: number): JSX.Element {
        return (
            <tr>
                <td>
                    <button
                        disabled={this.disabled || null}
                        onClick={() => this.onDelete(index)}
                        class="dot-key-value__delete-button"
                    >
                        {this.buttonLabel}
                    </button>
                </td>
                <td>{item.key}</td>
                <td>{item.value}</td>
            </tr>
        );
    }

    private renderRows(items: DotKeyValueField[]): JSX.Element {
        return this.isValidItems(items) ? items.map(this.getRow.bind(this)) : this.getEmptyRow();
    }

    private getEmptyRow(): JSX.Element {
        return (
            <tr>
                <td>{this.emptyMessage}</td>
            </tr>
        );
    }

    private isValidItems(items: DotKeyValueField[]): boolean {
        return Array.isArray(items) && !!items.length;
    }
}
