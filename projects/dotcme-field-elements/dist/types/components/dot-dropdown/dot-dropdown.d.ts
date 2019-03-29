import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { DotOption } from '../../models/dot-option.model';
export declare class DotDropdownComponent {
    label: string;
    hint: string;
    options: string;
    value: string;
    onChange: EventEmitter;
    _options: DotOption[];
    _value: string;
    _label: string;
    componentWillLoad(): void;
    setValue(event: any): void;
    render(): JSX.Element;
}
