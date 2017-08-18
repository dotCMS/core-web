// tslint:disable-next-line:max-file-line-count
import {Component, EventEmitter, ViewEncapsulation} from '@angular/core';
import {
    RuleModel, RuleService, ConditionGroupModel, ConditionModel, ActionModel,
    RuleEngineState
} from './services/Rule';
import {CwChangeEvent} from '../../api/util/CwEvent';
import {ServerSideFieldModel, ServerSideTypeModel} from './services/ServerSideFieldModel';
import {ConditionService} from './services/Condition';
import {ActionService} from './services/Action';
import {ConditionGroupService} from './services/ConditionGroup';
import {I18nService} from '../../api/system/locale/I18n';
import {Observable} from 'rxjs/Observable';
import {CwError} from '../../api/system/http-response-util';
import {BundleService, IPublishEnvironment} from '../../api/services/bundle-service';
import { ActivatedRoute } from '@angular/router';
import { HttpCode } from '../../api/util/http-code';
import {LoggerService} from '../../api/services/logger.service';

// tslint:disable-next-line:no-unused-variable
const I8N_BASE = 'api.sites.ruleengine';

export interface ParameterChangeEvent extends CwChangeEvent {
  rule?: RuleModel;
  source?: ServerSideFieldModel;
  name: string;
  value: string;
}

export interface TypeChangeEvent extends CwChangeEvent {
  rule?: RuleModel;
  source: ServerSideFieldModel;
  value: any;
  index: number;
}

export interface RuleActionEvent {
  type: string;
  payload: {
    rule?: RuleModel,
    value?: string|boolean
  };
}
export interface RuleActionActionEvent extends RuleActionEvent {
  payload: {
    rule?: RuleModel,
    value?: string|boolean,
    ruleAction?: ActionModel,
    index?: number, name?: string
  };
}
export interface ConditionGroupActionEvent extends RuleActionEvent {
  payload: {
    rule?: RuleModel,
    value?: string|boolean,
    conditionGroup?: ConditionGroupModel,
    index?: number,
    priority?: number
  };
}
export interface ConditionActionEvent extends RuleActionEvent {
  payload: {
    rule?: RuleModel,
    value?: string|boolean,
    condition?: ConditionModel,
    conditionGroup?: ConditionGroupModel,
    index?: number,
    name?: string
    type?: string};
}

/**
 *
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'cw-rule-engine-container',
  styleUrls: [
    'styles/rule-engine.scss',
    'styles/angular-material.layouts.scss',
    './semantic/assets/semantic.css'
  ],
  template: `
    <cw-rule-engine
      [environmentStores]="environments"
      [rules]="rules"
      [ruleActionTypes]="_ruleService._ruleActionTypes"
      [conditionTypes]="_ruleService._conditionTypes"
      [loading]="state.loading"
      [showRules]="state.showRules"
      [globalError]="state.globalError"
      (createRule)="onCreateRule($event)"
      (deleteRule)="onDeleteRule($event)"
      (updateName)="onUpdateRuleName($event)"
      (updateFireOn)="onUpdateFireOn($event)"
      (updateEnabledState)="onUpdateEnabledState($event)"
      (updateExpandedState)="onUpdateExpandedState($event)"

      (createRuleAction)="onCreateRuleAction($event)"
      (updateRuleActionType)="onUpdateRuleActionType($event)"
      (updateRuleActionParameter)="onUpdateRuleActionParameter($event)"
      (deleteRuleAction)="onDeleteRuleAction($event)"

      (createConditionGroup)="onCreateConditionGroup($event)"
      (updateConditionGroupOperator)="onUpdateConditionGroupOperator($event)"
      (createCondition)="onCreateCondition($event)"
      (updateConditionType)="onUpdateConditionType($event)"
      (updateConditionParameter)="onUpdateConditionParameter($event)"
      (updateConditionOperator)="onUpdateConditionOperator($event)"
      (deleteCondition)="onDeleteCondition($event)"
    ></cw-rule-engine>
`
})
export class RuleEngineContainer {

  rules: RuleModel[];
  state: RuleEngineState = new RuleEngineState();

  environments: IPublishEnvironment[] = [];

  rules$: EventEmitter<RuleModel[]> = new EventEmitter();
  ruleActions$: EventEmitter<ActionModel[]> = new EventEmitter();
  conditionGroups$: EventEmitter<ConditionGroupModel[]> = new EventEmitter();
  globalError: string;

  constructor(private _ruleService: RuleService,
              private _ruleActionService: ActionService,
              private _conditionGroupService: ConditionGroupService,
              private _conditionService: ConditionService,
              private _resources: I18nService,
              public bundleService: BundleService,
              private route: ActivatedRoute,
              private loggerService: LoggerService
  ) {
    this.rules$.subscribe(( rules ) => {
      this.rules = rules;
    });

    this.bundleService.loadPublishEnvironments().subscribe((environments) => this.environments = environments);
    this.initRules();

  }

  alphaSort(key): (a, b) => number {
    return (a, b) => {
      let x;
      if (a[key] > b[key]) {
        x = 1;
      } else if (a[key] < b[key]) {
        x = -1;
      } else {
            x = 0;
          }
      return x;
    };
  }

  /**
   *
   * @param event
   */
  onCreateRule(event): void {
    this.loggerService.info('RuleEngineContainer', 'onCreateRule', event);
    let priority = this.rules.length ? this.rules[0].priority + 1 : 1;
    let rule = new RuleModel({ priority});
    let group = new ConditionGroupModel({operator: 'AND', priority: 1});
    group._conditions.push(new ConditionModel({_type: new ServerSideTypeModel()}));
    rule._conditionGroups.push(group);
    let action = new ActionModel(null, new ServerSideTypeModel());
    action._owningRule = rule;
    rule._ruleActions.push(action);
    rule._saved = false;
    rule._expanded = true;
    this.rules$.emit([rule].concat(this.rules));
  }

  onDeleteRule(event: RuleActionEvent): void {
    let rule = event.payload.rule;
    rule._deleting = true;
    this.state.deleting = true;
    if (rule.isPersisted()) {
      this._ruleService.deleteRule(rule.key).subscribe(( result ) => {
        this.state.deleting = false;
      });
    }
    let rules = this.rules.filter((arrayRule) => arrayRule.key !== rule.key);
    this.rules$.emit(rules);
  }

  onUpdateEnabledState(event: RuleActionEvent): void {
    event.payload.rule.enabled = <boolean> event.payload.value;
    this.patchRule(event.payload.rule, false);
  }

  onUpdateRuleName(event: RuleActionEvent): void {
    event.payload.rule.name = <string> event.payload.value;
    this.patchRule(event.payload.rule, false);
  }

  onUpdateFireOn(event: RuleActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateFireOn', event);
    event.payload.rule.fireOn = <string> event.payload.value;
    this.patchRule(event.payload.rule, false);
  }

  onUpdateExpandedState(event: RuleActionEvent): void {
    let rule = event.payload.rule;
    rule._expanded = <boolean> event.payload.value;
    if (rule._expanded) {
      let obs2: Observable<ConditionGroupModel>;
      if (rule._conditionGroups.length === 0) {
        let obs: Observable<ConditionGroupModel[]> = this._conditionGroupService.allAsArray(rule.key, Object.keys(rule.conditionGroups));
        obs2 = obs.flatMap((groups: ConditionGroupModel[]) => Observable.from(groups));
      } else {
        obs2 = Observable.from(rule._conditionGroups);
      }
      let obs3: Observable<ConditionGroupModel> = obs2.flatMap(
          (group: ConditionGroupModel) => this._conditionService.listForGroup(group, this._ruleService._conditionTypes),
          (group: ConditionGroupModel, conditions: ConditionModel[]) => {
            if (conditions) {
              conditions.forEach((condition: ConditionModel) => {
                condition.type = this._ruleService._conditionTypes[condition.conditionlet];
              });
            }
            group._conditions = conditions;
            return group;
          }
      );

      let obs4: Observable<ConditionGroupModel[]> = obs3.reduce(
          (acc: ConditionGroupModel[], group: ConditionGroupModel) => {
            acc.push(group);
            return acc;
          }, []);

      obs4.subscribe((groups: ConditionGroupModel[]) => {
        rule._conditionGroups = groups;
        if (rule._conditionGroups.length === 0) {
          this.loggerService.info('RuleEngineContainer', 'conditionGroups', 'Add stub group');
          let group = new ConditionGroupModel({operator: 'AND', priority: 1});
          group._conditions.push(new ConditionModel({_type: new ServerSideTypeModel(), operator: 'AND', priority: 1}));
          rule._conditionGroups.push(group);
        } else {
          rule._conditionGroups.sort(this.prioritySortFn);
          rule._conditionGroups.forEach((group: ConditionGroupModel) => {
            group._conditions.sort(this.prioritySortFn);
            if (group._conditions.length === 0) {
              group._conditions.push(new ConditionModel({_type: new ServerSideTypeModel(), operator: 'AND', priority: 1}));
            }
          });
        }
      }, (e) => {
        this.loggerService.error('RuleEngineContainer', e);
      });

      if (rule._ruleActions.length === 0) {
        this._ruleActionService.allAsArray(rule.key, Object.keys(rule.ruleActions), this._ruleService._ruleActionTypes).subscribe((actions) => {
          rule._ruleActions = actions;
          if (rule._ruleActions.length === 0) {
            let action = new ActionModel(null, new ServerSideTypeModel(), 1);
            rule._ruleActions.push(action);
            rule._ruleActions.sort(this.prioritySortFn);
          } else {
            rule._ruleActions.sort(this.prioritySortFn);
          }
        });
      }
    }
  }

  onCreateRuleAction(event: RuleActionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onCreateRuleAction', event);
    let rule = event.payload.rule;
    let priority = rule._ruleActions.length ? rule._ruleActions[rule._ruleActions.length - 1].priority + 1 : 1;
    let entity = new ActionModel(null, new ServerSideTypeModel(), priority);

    this.patchRule(rule, true);
    rule._ruleActions.push(entity);
    rule._saved = false;
  }

  onDeleteRuleAction(event: RuleActionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onDeleteRuleAction', event);
    let rule = event.payload.rule;
    let ruleAction = event.payload.ruleAction;
    if (ruleAction.isPersisted()) {
      this._ruleActionService.remove(rule.key, ruleAction).subscribe((result) => {
        rule._ruleActions = rule._ruleActions.filter((aryAction) => {
          return aryAction.key !== ruleAction.key;
        });
        if (rule._ruleActions.length === 0) {
          rule._ruleActions.push(new ActionModel(null, new ServerSideTypeModel(), 1));
        }
      });
    }
  }

  onUpdateRuleActionType(event: RuleActionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateRuleActionType');
    try {
      let ruleAction = event.payload.ruleAction;
      let rule = event.payload.rule;
      let idx = event.payload.index;
      let type: ServerSideTypeModel = this._ruleService._ruleActionTypes[<string> event.payload.value];
      rule._ruleActions[idx] = new ActionModel(ruleAction.key, type, ruleAction.priority);
      this.patchAction(rule, ruleAction);
    } catch (e) {
      this.loggerService.error('RuleComponent', 'onActionTypeChange', e);
    }
  }

  onUpdateRuleActionParameter(event: RuleActionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateRuleActionParameter');
    let ruleAction = event.payload.ruleAction;
    ruleAction.setParameter(event.payload.name, event.payload.value);
    this.patchAction(event.payload.rule, ruleAction);
  }

  onCreateConditionGroup(event: ConditionGroupActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onCreateConditionGroup');
    let rule = event.payload.rule;
    let priority = rule._conditionGroups.length ? rule._conditionGroups[rule._conditionGroups.length - 1].priority + 1 : 1;
    let group = new ConditionGroupModel({operator: 'AND', priority: priority});
    group._conditions.push(new ConditionModel({_type: new ServerSideTypeModel(), operator: 'AND', priority: 1}));
    rule._conditionGroups.push(group);
    rule._conditionGroups.sort(this.prioritySortFn);
  }

  onUpdateConditionGroupOperator(event: ConditionGroupActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateConditionGroupOperator');
    const group = event.payload.conditionGroup;
    group.operator = <string> event.payload.value;
    if (group.key != null) {
      this.patchConditionGroup(event.payload.rule, group);
      this.patchRule(event.payload.rule);
    }
  }

  onDeleteConditionGroup(event: ConditionGroupActionEvent): void {
    const rule = event.payload.rule;
    const group = event.payload.conditionGroup;
    this._conditionGroupService.remove(rule.key, group).subscribe();
    rule._conditionGroups = rule._conditionGroups.filter((aryGroup) => aryGroup.key !== group.key );
  }

  onCreateCondition(event: ConditionActionEvent): void {

    let rule = event.payload.rule;
    this.ruleUpdating(rule, true);
    try {
      const group = event.payload.conditionGroup;
      const priority = group._conditions.length ? group._conditions[group._conditions.length - 1].priority + 1 : 1;
      const entity = new ConditionModel({_type: new ServerSideTypeModel(), operator: 'AND', priority: priority});
      group._conditions.push(entity);
      this.ruleUpdated(rule);
    } catch (e) {
      this.loggerService.error('RuleEngineContainer', 'onCreateCondition', e);
      this.ruleUpdated(rule, [{unhandledError: e}]);
    }
  }

  onUpdateConditionType(event: ConditionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateConditionType');
    try {
      let condition = event.payload.condition;
      const group = event.payload.conditionGroup;
      const rule = event.payload.rule;
      const idx = event.payload.index;
      const type: ServerSideTypeModel = this._ruleService._conditionTypes[<string> event.payload.value];
      // replace the condition rather than mutate it to force event for 'onPush' NG2 components.
      condition = new ConditionModel({_type: type, id: condition.key, operator: condition.operator, priority: condition.priority});
      group._conditions[idx] = condition;
      this.patchCondition(rule, group, condition);
    } catch (e) {
      this.loggerService.error('RuleComponent', 'onActionTypeChange', e);
    }
  }

  onUpdateConditionParameter(event: ConditionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateConditionParameter');
    const condition = event.payload.condition;
    condition.setParameter(event.payload.name, event.payload.value);
    this.patchCondition(event.payload.rule, event.payload.conditionGroup, condition);
  }

  onUpdateConditionOperator(event: ConditionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onUpdateConditionOperator');
    const condition = event.payload.condition;
    condition.operator = <string> event.payload.value;
    this.patchCondition(event.payload.rule, event.payload.conditionGroup, condition);
  }

  onDeleteCondition(event: ConditionActionEvent): void {
    this.loggerService.info('RuleEngineContainer', 'onDeleteCondition', event);
    let rule = event.payload.rule;
    let group = event.payload.conditionGroup;
    let condition = event.payload.condition;
    if (condition.isPersisted()) {
      this._conditionService.remove(condition).subscribe((result) => {
        group._conditions = group._conditions.filter((aryCondition) => {
          return aryCondition.key !== condition.key;
        });
        if (group._conditions.length === 0) {
          this.loggerService.info('RuleEngineContainer', 'condition', 'Remove Condition and remove Groups is empty');
          this._conditionGroupService.remove(rule.key, group).subscribe();
          rule._conditionGroups = rule._conditionGroups.filter((aryGroup) => aryGroup.key !== group.key );
        }
        if (rule._conditionGroups.length === 0) {
          this.loggerService.info('RuleEngineContainer', 'conditionGroups', 'Add stub group if Groups are empty');
          const group = new ConditionGroupModel({operator: 'AND', priority: 1});
          group._conditions.push(new ConditionModel({_type: new ServerSideTypeModel(), operator: 'AND', priority: 1}));
          rule._conditionGroups.push(group);
        }
      });
    }
  }

  ruleUpdating(rule, disable = true): void {
    if (disable && rule.enabled && rule.key) {
      this.loggerService.info('RuleEngineContainer', 'ruleUpdating', 'disabling rule due for edit.');
      this.patchRule(rule, true);
    }
    rule._saved = false;
    rule._saving = true;
    rule._errors = null;
  }

  ruleUpdated(rule: RuleModel, errors?: {[key: string]: any}): void {
    rule._saving = false;
    if (!errors) {
      rule._saved = true;
    } else {
      this.loggerService.error(errors);
      rule._errors = errors;
    }
  }

  patchConditionGroup(rule: RuleModel, group: ConditionGroupModel, disable= true): void {
    this.ruleUpdating(rule, false);
    if (disable && rule.enabled) {
      rule.enabled = false;
    }
    this._conditionGroupService.updateConditionGroup(rule.key, group).subscribe(( result ) => {
    });
  }

  patchRule(rule: RuleModel, disable= true): void {
    this.ruleUpdating(rule, false);
    if (disable && rule.enabled) {
      rule.enabled = false;
    }
    if (rule.isValid()) {
      if (rule.isPersisted()) {
        this._ruleService.updateRule(rule.key, rule).subscribe(() => {
          this.ruleUpdated(rule);
        }, (e: CwError) => {
          const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
          this.ruleUpdated(rule, ruleError);
        });
      } else {
        this._ruleService.createRule(rule).subscribe(() => {
          this.ruleUpdated(rule);
        }, (e: CwError) => {
          const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
          this.ruleUpdated(rule, ruleError);
        });
      }
    } else {
      this.ruleUpdated(rule, {
        invalid: 'Cannot save, rule is not valid.'
      });
    }
  }

  patchAction(rule: RuleModel, ruleAction: ActionModel): void {
    this.ruleUpdating(rule);
    if (ruleAction.isValid()) {
      if (!ruleAction.isPersisted()) {
        this._ruleActionService.createRuleAction(rule.key, ruleAction).subscribe((result) => {
          this.ruleUpdated(rule);
        }, (e: CwError) => {
          const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
          this.ruleUpdated(rule, ruleError);
        });
      } else {
        this._ruleActionService.updateRuleAction(rule.key, ruleAction).subscribe((result) => {
          this.ruleUpdated(rule);
        }, (e: any) => {
          const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
          this.ruleUpdated(rule, ruleError);
        });
      }
    }else {
      this.ruleUpdated(rule, {
        invalid: 'Cannot save, action is not valid.'
      });
    }
  }

  patchCondition(rule: RuleModel, group: ConditionGroupModel, condition: ConditionModel): void {
    this.ruleUpdating(rule);
    try {
      if (condition.isValid()) {
        if (condition.isPersisted()) {
          this._conditionService.save(group.key, condition).subscribe((result) => {
            this.ruleUpdated(rule);
          }, (e: any) => {
            const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
            this.ruleUpdated(rule, ruleError);
          });
        } else {
          if (!group.isPersisted()) {
            this._conditionGroupService.createConditionGroup(rule.key, group).subscribe((foo) => {
              this._conditionService.add(group.key, condition).subscribe(() => {
                group.conditions[condition.key] = true;
                this.ruleUpdated(rule);
              }, (e: CwError) => {
                const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
                this.ruleUpdated(rule, ruleError);
              });
            });
          } else {
            this._conditionService.add(group.key, condition).subscribe(() => {
              group.conditions[condition.key] = true;
              this.ruleUpdated(rule);
            }, (e: CwError) => {
              const ruleError = this._handle403Error(e) ? null : {invalid: e.message};
              this.ruleUpdated(rule, ruleError);
            });
          }
        }
      } else {
        this.loggerService.info('RuleEngineContainer', 'patchCondition', 'Not valid');
        rule._saving = false;
        rule._errors = { invalid: 'Condition not valid.' };
      }
    } catch (e) {
      this.loggerService.error(e);
      this.ruleUpdated(rule, {invalid: e.message});
    }
  }

  prioritySortFn(a: any, b: any): number {
    return a.priority - b.priority;
  }

  // tslint:disable-next-line:no-unused-variable
  private preCacheCommonResources(resources: I18nService): void {
    resources.get('api.sites.ruleengine').subscribe((rsrc) => {});
    resources.get('api.ruleengine.system').subscribe((rsrc) => {});
    resources.get('api.system.ruleengine').subscribe((rsrc) => {});
  }

  private initRules(): void {
    this.state.loading = true;

    let siteId = '';
    this.route.queryParams.subscribe(params => {
      siteId = params['realmId'];
    });

    this._ruleService.requestRules(siteId);

    this._ruleService.loadRules().subscribe((rules: RuleModel[]) => {
       this.loadRules(rules);
    });
  }

  private loadRules(rules: RuleModel[]): void {
    rules.sort( (a, b) => {
      return b.priority - a.priority;
    });
    this.rules$.emit(rules);
    this.state.loading = false;
  }

  private _handle403Error(e: CwError): boolean {
    let handled = false;
    try {
      if (e && e.response.status === HttpCode.FORBIDDEN) {
        const errorJson = e.response.json();
        if (errorJson && errorJson.error) {
          this.state.globalError = errorJson.error.replace('dotcms.api.error.forbidden: ', '');
          handled = true;
        }
      }
    } catch (e) {
      this.loggerService.error('Error while processing invalid response: ', e);
    }
    return handled;
  }
}
