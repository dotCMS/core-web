import {Component, EventEmitter, Optional } from '@angular/core';
import { AfterViewInit, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import {NgControl, ControlValueAccessor, } from '@angular/forms';
import {Http} from '@angular/http';

import {Verify} from '../../../../../api/validation/Verify';
import {ApiRoot} from '../../../../../api/persistence/ApiRoot';
import {Observable} from 'rxjs';
import _ from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cw-input-rest-dropdown',
  template: `
  <cw-input-dropdown
      [value]="_modelValue"
      placeholder="{{placeholder}}"
      [maxSelections]="maxSelections"
      [minSelections]="minSelections"
       [allowAdditions]="allowAdditions"
      (onDropDownChange)="fireChange($event)"
      (touch)="fireTouch($event)"
      >
        <cw-input-option *ngFor="let opt of _options | async" [value]="opt.value" [label]="opt.label" [icon]="opt.icon"></cw-input-option>
      </cw-input-dropdown>`,
})
export class RestDropdown implements AfterViewInit, ControlValueAccessor {

  @Input() placeholder: string;
  @Input() allowAdditions: boolean;
  @Input() minSelections: number;
  @Input() maxSelections: number;
  @Input() optionUrl: string;
  @Input() optionValueField: string;
  @Input() optionLabelField: string;
  @Input() value: string;

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() touch: EventEmitter<any> = new EventEmitter();

  private _modelValue: string;
  private _options: Observable<any[]>;

  onChange: Function = (  ) => { };
  onTouched: Function = (  ) => { };

  constructor(private _http: Http, private _apiRoot: ApiRoot, @Optional() public control: NgControl) {
    if (control) {
      control.valueAccessor = this;
    }

    this.placeholder = '';
    this.optionValueField = 'key';
    this.optionLabelField = 'value';
    this.allowAdditions = false;
    this.minSelections = 0;
    this.maxSelections = 1;
  }

  ngAfterViewInit(): void {
  }

  writeValue(value: any): void {
    if (value && value.indexOf(',') > -1) {
      this._modelValue = value.split(',');
    } else {
      this._modelValue = _.isEmpty(value) ? '' : value;
    }
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  fireChange($event): void {
    this.change.emit($event);
    this.onChange($event);
  }

  fireTouch($event): void {
    this.touch.emit($event);
    this.onTouched($event);
  }

  ngOnChanges(change): void {
    if (change.optionUrl) {
      let requestOptionArgs = this._apiRoot.getDefaultRequestOptions();
      this._options = this._http.get(change.optionUrl.currentValue, requestOptionArgs)
          .map((res: any) => this.jsonEntriesToOptions(res));
    }

    if (change.value && change.value.currentValue && change.value.currentValue.indexOf(',') > -1) {
        this._modelValue = change.value.currentValue.split(',');
    }
  }

  private jsonEntriesToOptions(res: any): any {
    let valuesJson = res.json();
    let ary = [];
    if (Verify.isArray(valuesJson)) {
      ary = valuesJson.map(valueJson => this.jsonEntryToOption(valueJson));
    } else {
      ary = Object.keys(valuesJson).map((key) => {
        return this.jsonEntryToOption(valuesJson[key], key);
      });
    }
    return ary;
  }

  private jsonEntryToOption(json: any, key: string = null): {value: string, label: string} {
    let opt = {value: null, label: null};
    if (!json[this.optionValueField] && this.optionValueField === 'key' && key != null) {
      opt.value = key;
    } else {
      opt.value = json[this.optionValueField];
    }
    opt.label = json[this.optionLabelField];
    return opt;
  }
}