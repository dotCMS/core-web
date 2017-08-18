import { Component, EventEmitter, Input, Output} from '@angular/core';
import {ServerSideTypeModel} from './services/ServerSideFieldModel';
import {I18nService} from '../../api/system/locale/I18n';
import {
    RULE_CONDITION_UPDATE_PARAMETER, RULE_CONDITION_UPDATE_TYPE,
    RULE_CONDITION_DELETE, RULE_CONDITION_UPDATE_OPERATOR, ConditionModel
} from './services/Rule';
import {LoggerService} from '../../api/services/logger.service';

@Component({
  selector: 'rule-condition',
  template: `<div *ngIf="typeDropdown != null" flex layout="row" class="cw-condition cw-entry">
  <div class="cw-btn-group cw-condition-toggle">
    <button class="ui basic button cw-button-toggle-operator" aria-label="Swap And/Or" (click)="toggleOperator()" *ngIf="index !== 0">
      {{condition.operator}}
    </button>
  </div>
  <cw-input-dropdown
      flex="25"
      class="cw-type-dropdown"
      [value]="condition.type?.key"
      placeholder="{{conditionTypePlaceholder}}"
      (onDropDownChange)="onTypeChange($event)">
    <cw-input-option
        *ngFor="let opt of typeDropdown.options"
        [value]="opt.value"
        [label]="opt.label"
        icon="{{opt.icon}}"></cw-input-option>
  </cw-input-dropdown>
  <div flex="75" class="cw-condition-row-main" [ngSwitch]="condition.type?.key">
    <ng-template [ngSwitchCase]="'NoSelection'">
      <div class="cw-condition-component"></div>
    </ng-template>
    <ng-template [ngSwitchCase]="'VisitorsGeolocationConditionlet'">
      <cw-visitors-location-container
          [componentInstance]="condition"
          (parameterValuesChange)="onParameterValuesChange($event)"></cw-visitors-location-container>
    </ng-template>
    <ng-template ngSwitchDefault>
      <cw-serverside-condition class="cw-condition-component"
                               [componentInstance]="condition"
                               (parameterValueChange)="onParameterValueChange($event)">
      </cw-serverside-condition>
    </ng-template>
  </div>
</div>
<div class="cw-btn-group cw-delete-btn">
  <div class="ui basic icon buttons">
    <button class="ui button" aria-label="Delete Condition" (click)="onDeleteConditionClicked()" [disabled]="!condition.isPersisted()">
      <i class="trash icon"></i>
    </button>
  </div>
</div>
`
})
export class ConditionComponent {

  @Input() condition: ConditionModel;
  @Input() index: number;
  @Input() conditionTypes: {[key: string]: ServerSideTypeModel} = {};
  @Input() conditionTypePlaceholder = '';

  @Output() updateConditionType: EventEmitter<{type: string, payload: Payload}> = new EventEmitter(false);
  @Output() updateConditionParameter: EventEmitter<{type: string, payload: Payload}> = new EventEmitter(false);
  @Output() updateConditionOperator: EventEmitter<{type: string, payload: Payload}> = new EventEmitter(false);

  @Output() deleteCondition: EventEmitter<{type: string, payload: {condition: ConditionModel}}> = new EventEmitter(false);

  typeDropdown: any;

  constructor(private _resources: I18nService, private loggerService: LoggerService) {
  }

  ngOnChanges(change): void {
    try {
      if (change.condition) {
        if (this.typeDropdown && this.condition.type) {
          if (this.condition.type.key !== 'NoSelection') {
            this.typeDropdown.value = this.condition.type.key;
          }
        }
      }
      if (change.conditionTypes && !this.typeDropdown) {
        this.typeDropdown = {
          options: [],
          placeholder: this._resources.get('api.sites.ruleengine.rules.inputs.condition.type.placeholder'),
        };
        Object.keys(this.conditionTypes).forEach(key => {
          let type = this.conditionTypes[key];
          this.typeDropdown.options.push(type._opt);
        });
      }
    } catch (e) {
      this.loggerService.error('ConditionComponent', 'ngOnChanges', e);
    }
  }

  onTypeChange(type: string): void {
    this.loggerService.info('ConditionComponent', 'onTypeChange', type);
    this.updateConditionType.emit({
      payload: {condition: this.condition, value: type, index: this.index},
      type: RULE_CONDITION_UPDATE_TYPE
    });
  }

  onParameterValuesChange(event: {name: string, value: string}[]): void {
    event.forEach((change) => this.onParameterValueChange(change));
  }

  onParameterValueChange(event: {name: string, value: string}): void {
    this.loggerService.info('ConditionComponent', 'onParameterValueChange');
    this.updateConditionParameter.emit({
      payload: {condition: this.condition, name: event.name, value: event.value, index: this.index},
      type: RULE_CONDITION_UPDATE_PARAMETER
    });
  }

  toggleOperator(): void {
    let op = this.condition.operator === 'AND' ? 'OR' : 'AND';
    this.updateConditionOperator.emit({type: RULE_CONDITION_UPDATE_OPERATOR, payload: {condition: this.condition, value: op, index: this.index}});
  }

  onDeleteConditionClicked(): void {
    this.deleteCondition.emit({type: RULE_CONDITION_DELETE, payload: {condition: this.condition}});
  }
}

interface Payload {
  condition: ConditionModel;
  index?: number;
  name?: string;
  value: string;
}
