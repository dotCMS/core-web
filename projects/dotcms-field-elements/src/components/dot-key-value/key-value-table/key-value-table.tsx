import { Component, Prop, Event, EventEmitter } from '@stencil/core';
import { KeyValue } from '../../../models';

@Component({
    tag: 'key-value-table'
})
export class DotTextfieldComponent {
    @Prop() keyValues: KeyValue[] = [];
    @Prop() disabled = false;

    @Event() deleteKeyValue: EventEmitter;

    render() {
        return (
            <table>
                <tbody>
                    {this.keyValues.map((item, index) => {
                        return (
                            <tr>
                                <td>
                                    <button
                                        type="button"
                                        disabled={this.disabled || null}
                                        onClick={() => this.deleteKey(index)}
                                        class="dot-key-value__delete__button"
                                    >
                                        <i class="dot-key-value__delete-button__icon" />
                                    </button>
                                </td>
                                <td>{item.key}</td>
                                <td>{item.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    private deleteKey(index: number): void {
        this.deleteKeyValue.emit(index);
    }
}
