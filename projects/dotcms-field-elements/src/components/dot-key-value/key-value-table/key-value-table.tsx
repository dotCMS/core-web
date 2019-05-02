import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'key-value-table'
})
export class DotTextfieldComponent {
    @Prop() values: {
        key: string;
        value: string;
    }[] = [];
    @Prop() disabled = false;

    @Event() deleteItemEvt: EventEmitter;

    render() {
        return (
            <table>
                <tbody>
                    {this.values.map((item, index) => {
                        return (
                            <tr>
                                <td>
                                    <button
                                        type="button"
                                        id={`${item.key}_${item.value}_${index}`}
                                        disabled={this.disabled || null}
                                        onClick={() => this.deleteItem(index)}
                                        class="dot-key-value__delete__button"
                                    >
                                        <label htmlFor={`${item.key}_${item.value}_${index}`}>
                                            Delete
                                        </label>
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

    private deleteItem(index: number): void {
        this.deleteItemEvt.emit(index);
    }
}
