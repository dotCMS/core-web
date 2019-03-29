import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class DotTextfieldComponent {
    value: string;
    regexcheck: string;
    readOnly: string;
    label: string;
    hint: string;
    placeholder: string;
    required: boolean;
    onChange: EventEmitter;
    _value: string;
    _error: boolean;
    _label: string;
    validate(value: string): boolean;
    setValue(event: any): void;
    componentWillLoad(): void;
    render(): JSX.Element;
}
