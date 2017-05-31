import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Optional
} from '@angular/core';
import {NgControl, ControlValueAccessor} from '@angular/forms';
import _ from 'lodash';

/**
 * Angular 2 wrapper around Semantic UI Input Element.
 * @see http://semantic-ui.com/elements/input.html
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'role': 'text'},
  selector: 'cw-input-date',
  template: `<div flex layout="row" layout-wrap class="ui fluid input"  [ngClass]="{disabled: disabled, icon: icon, required: required}">
    <input flex
           type="datetime-local"
           [value]="_modelValue"
           [disabled]="disabled"
           tabindex="{{tabIndex || ''}}"
           placeholder="{{placeholder}}"
           (blur)="onBlur($event)"
           (change)="$event.stopPropagation()"
           (input)="onChange($event.target.value)" />
    <i [ngClass]="icon" *ngIf="icon"></i>
</div>
  `,
})
export class InputDate implements ControlValueAccessor {

  private static DEFAULT_VALUE: string;

  @Input() placeholder = '';
  @Input() type = '';
  @Input() value = '';
  @Input() icon: string;
  @Input() disabled = false;
  @Input() focused = false;
  @Input() tabIndex: number = null;
  @Input() required = false;

  @Output() blur: EventEmitter<any> = new EventEmitter();

  errorMessage: string;
  onChange: Function;
  onTouched: Function;

  private _modelValue: any;

  private static _defaultValue(): string {
    let d = new Date();

    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    let r = d.toISOString();
    r = r.substring(0, r.indexOf('T') + 1);
    r = r + '00:00:00';
    return r;
  }

  constructor( @Optional() control: NgControl, private _elementRef: ElementRef) {
    if (control) {
      control.valueAccessor = this;
    }

    if (!InputDate.DEFAULT_VALUE) {
      InputDate.DEFAULT_VALUE = InputDate._defaultValue();
    }
  }

  ngOnChanges(change): void {
    if (change.focused) {
      let f = change.focused.currentValue === true || change.focused.currentValue === 'true';
      if (f) {
        let el = this._elementRef.nativeElement;
        el.children[0].children[0].focus();
      }
    }
  }

  onBlur(value): void {
    this.onTouched();
    this.blur.emit(value);
  }

  writeValue(value: any): void {
    this._modelValue = _.isEmpty(value) ? InputDate.DEFAULT_VALUE : value;
    this._elementRef.nativeElement.firstElementChild.firstElementChild.setAttribute('value', this._modelValue);
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }
}
