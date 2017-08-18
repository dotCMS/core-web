import {Component, EventEmitter, ElementRef, Input, Output, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs/Rx';

import {
    RuleModel, RULE_UPDATE_ENABLED_STATE,
    RULE_UPDATE_NAME,
    RULE_DELETE,
    RULE_RULE_ACTION_UPDATE_TYPE,
    RULE_RULE_ACTION_UPDATE_PARAMETER,
    V_RULE_UPDATE_EXPANDED_STATE, RULE_CONDITION_UPDATE_PARAMETER, RULE_CONDITION_UPDATE_OPERATOR,
    RULE_CONDITION_UPDATE_TYPE, ConditionGroupModel, ActionModel, RULE_RULE_ACTION_DELETE, RULE_RULE_ACTION_CREATE,
    RULE_CONDITION_GROUP_CREATE, RuleService
} from './services/Rule';

import {I18nService} from '../../api/system/locale/I18n';
import {UserModel} from '../../api/auth/UserModel';
import {ApiRoot} from '../../api/persistence/ApiRoot';
import {
    ConditionActionEvent,
    RuleActionActionEvent, RuleActionEvent, ConditionGroupActionEvent
} from './rule-engine.container';
import {ServerSideTypeModel} from './services/ServerSideFieldModel';
import {IPublishEnvironment} from '../../api/services/bundle-service';
import { LoggerService } from '../../api/services/logger.service';

const I8N_BASE = 'api.sites.ruleengine';
// tslint:disable-next-line:no-unused-variable
let rsrc = {
  fireOn: {
    EVERY_PAGE: 'Every Page',
    EVERY_REQUEST: 'Every Request',
    ONCE_PER_VISIT: 'Once per visit',
    ONCE_PER_VISITOR: 'Once per visitor',
  }
};

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'rule',
  template: `<form [formGroup]="formModel" let rf="ngForm">
  <cw-add-to-bundle-dialog-container
      [assetId]="rule.id || rule.key"
      [hidden]="!showAddToBundleDialog"
      (close)="showAddToBundleDialog = false; showMoreMenu = false"></cw-add-to-bundle-dialog-container>
  <cw-push-publish-dialog-container
      [environmentStores]="environmentStores"
      [assetId]="rule.id || rule.key"
      [hidden]="!showPushPublishDialog"
      (close)="showPushPublishDialog = false; showMoreMenu = false"></cw-push-publish-dialog-container>
  <div class="cw-rule" [class.cw-hidden]="hidden" [class.cw-disabled]="!rule.enabled"
    [class.cw-saving]="saving" [class.cw-saved]="saved" [class.cw-out-of-sync]="!saved && !saving">
  <div flex layout="row" class="cw-header" *ngIf="!hidden" (click)="setRuleExpandedState(!rule._expanded)">
    <div flex="70" layout="row" layout-align="start center" class="cw-header-info" >
      <i flex="none" class="caret icon cw-rule-caret large" [class.right]="!rule._expanded" [class.down]="rule._expanded" aria-hidden="true"></i>
      <div flex="70" layout="column">
      <cw-input-text class="cw-rule-name-input"
                     focused="{{rule.key == null}}"
                     placeholder="{{rsrc('inputs.name.placeholder') | async}}"
                     formControlName="name"
                     (click)="$event.stopPropagation()">
      </cw-input-text>
      <div flex="50" [hidden]="!formModel.controls['name'].touched || formModel.controls['name'].valid"
        class="name cw-warn basic label">Name is required
      </div>
      </div>
      <span class="cw-fire-on-label" *ngIf="!hideFireOn">{{rsrc('inputs.fireOn.label') | async}}</span>
      <cw-input-dropdown flex="none"
                         *ngIf="!hideFireOn"
                         class="cw-fire-on-dropdown"
                         [value]="fireOn.value"
                         placeholder="{{fireOn.placeholder | async}}"
                         (onDropDownChange)="updateFireOn.emit({type: 'RULE_UPDATE_FIRE_ON', payload:{rule:rule, value:$event}})"
                         (click)="$event.stopPropagation()">
        <cw-input-option *ngFor="let opt of fireOn.options"
            [value]="opt.value"
            [label]="opt.label | async"
            icon="{{opt.icon}}"></cw-input-option>
      </cw-input-dropdown>
    </div>
    <div flex="30" layout="row" layout-align="end center" class="cw-header-actions" >
      <span class="cw-rule-status-text" title="{{statusText()}}">{{statusText(30)}}</span>
      <cw-toggle-input class="cw-input"
                       [disabled]="!saved"
                       [value]="rule.enabled"
                       (change)="setRuleEnabledState($event)"
                       (click)="$event.stopPropagation()">
      </cw-toggle-input>
      <div class="cw-btn-group">
        <div class="ui basic icon buttons">
          <button class="ui button cw-delete-rule" aria-label="More Actions" (click)="showMoreMenu = !showMoreMenu; $event.stopPropagation()">
            <i class="ellipsis vertical icon"></i>
          </button>
          <button class="ui button cw-add-group" arial-label="Add Group"
            (click)="onCreateConditionGroupClicked(); setRuleExpandedState(true); $event.stopPropagation()" [disabled]="!rule.isPersisted()">

            <i class="plus icon" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="ui vertical menu" *ngIf="showMoreMenu">
        <a class="item" *ngIf="(rule.id || rule.key) &&  !apiRoot.hideRulePushOptions"
          (click)="showAddToBundleDialog = true; $event.stopPropagation()">Add to bundle</a>

        <a class="item" *ngIf="environmentStores.length > 0 && (rule.id || rule.key) &&  !apiRoot.hideRulePushOptions"
          (click)="showPushPublishDialog = true; $event.stopPropagation()">Push Publish</a>
        <a class="item" (click)="deleteRuleClicked($event)">Delete rule</a>
      </div>
    </div>
  </div>
  <div class="cw-accordion-body" *ngIf="rule._expanded">
    <condition-group *ngFor="let group of rule._conditionGroups; let i=index"
                     [group]="group"
                     [conditionTypes]="conditionTypes"
                     [groupIndex]="i"
                     [conditionTypePlaceholder]="conditionTypePlaceholder"
                     (createCondition)="onCreateCondition($event)"
                     (deleteCondition)="onDeleteCondition($event, group)"
                     (updateConditionGroupOperator)="onUpdateConditionGroupOperator($event, group)"
                     (updateConditionType)="onUpdateConditionType($event, group)"
                     (updateConditionParameter)="onUpdateConditionParameter($event, group)"
                     (updateConditionOperator)="onUpdateConditionOperator($event, group)"
                     ></condition-group>
    <div class="cw-action-group">
      <div class="cw-action-separator">
        {{rsrc('inputs.action.firesActions') | async}}
      </div>
      <div flex layout="column" class="cw-rule-actions">
        <div layout="row" class="cw-action-row" *ngFor="let ruleAction of ruleActions; let i=index">
          <rule-action flex layout="row" [action]="ruleAction" [index]="i"
              [actionTypePlaceholder]="actionTypePlaceholder"
              [ruleActionTypes]="ruleActionTypes"
              (updateRuleActionType)="onUpdateRuleActionType($event)"
               (updateRuleActionParameter)="onUpdateRuleActionParameter($event)"
              (deleteRuleAction)="onDeleteRuleAction($event)"></rule-action>
          <div class="cw-btn-group cw-add-btn">
            <div class="ui basic icon buttons" *ngIf="i === (ruleActions.length - 1)">
              <button class="cw-button-add-item ui button" arial-label="Add Action"
                (click)="onCreateRuleAction();" [disabled]="!ruleAction.isPersisted()">
                <i class="plus icon" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</form>
`
})
class RuleComponent {
  @Input() rule: RuleModel;
  @Input() saved: boolean;
  @Input() saving: boolean;
  @Input() errors: {[key: string]: any};
  @Input() ruleActions: ActionModel[];
  @Input() ruleActionTypes: {[key: string]: ServerSideTypeModel} = {};
  @Input() conditionTypes: {[key: string]: ServerSideTypeModel};
  @Input() environmentStores: IPublishEnvironment[];

  @Input() hidden = false;

  @Output() deleteRule: EventEmitter<RuleActionEvent> = new EventEmitter(false);
  @Output() updateExpandedState: EventEmitter<RuleActionEvent> = new EventEmitter(false);
  @Output() updateName: EventEmitter<RuleActionEvent> = new EventEmitter(false);
  @Output() updateEnabledState: EventEmitter<RuleActionEvent> = new EventEmitter(false);
  @Output() updateFireOn: EventEmitter<RuleActionEvent> = new EventEmitter(false);

  @Output() createRuleAction: EventEmitter<RuleActionActionEvent> = new EventEmitter(false);
  @Output() updateRuleActionType: EventEmitter<RuleActionActionEvent> = new EventEmitter(false);
  @Output() updateRuleActionParameter: EventEmitter<RuleActionActionEvent> = new EventEmitter(false);
  @Output() deleteRuleAction: EventEmitter<RuleActionActionEvent> = new EventEmitter(false);

  @Output() updateConditionGroupOperator: EventEmitter<ConditionGroupActionEvent> = new EventEmitter(false);
  @Output() createConditionGroup: EventEmitter<ConditionGroupActionEvent> = new EventEmitter(false);

  @Output() createCondition: EventEmitter<ConditionActionEvent> = new EventEmitter(false);
  @Output() deleteCondition: EventEmitter<ConditionActionEvent> = new EventEmitter(false);
  @Output() updateConditionType: EventEmitter<ConditionActionEvent> = new EventEmitter(false);
  @Output() updateConditionParameter: EventEmitter<ConditionActionEvent> = new EventEmitter(false);
  @Output() updateConditionOperator: EventEmitter<ConditionActionEvent> = new EventEmitter(false);

  private _updateEnabledStateDelay: EventEmitter<{type: string, payload: {rule: RuleModel, value: boolean}}> = new EventEmitter(false);

  private hideFireOn: boolean;
  private formModel: FormGroup;

  private fireOn: any;
  private _rsrcCache: {[key: string]: Observable<string>};

  // tslint:disable-next-line:no-unused-variable
  private showMoreMenu = false;
  // tslint:disable-next-line:no-unused-variable
  private showAddToBundleDialog = false;
  // tslint:disable-next-line:no-unused-variable
  private showPushPublishDialog = false;
  private actionTypePlaceholder = '';
  private conditionTypePlaceholder = '';

  constructor(private _user: UserModel,
              public elementRef: ElementRef,
              public resources: I18nService,
              public ruleService: RuleService,
              public apiRoot: ApiRoot,
              fb: FormBuilder,
              private loggerService: LoggerService) {
    this._rsrcCache = {};
    this.hideFireOn = apiRoot.hideFireOn;

    /* Need to delay the firing of the state change toggle, to give any blur events time to fire. */
    this._updateEnabledStateDelay.debounceTime(20).subscribe((event: RuleActionEvent) => {
      this.updateEnabledState.emit(event);
    });

    this.fireOn = {
      options: [
        {label: this.rsrc('inputs.fireOn.options.EveryPage'), value: 'EVERY_PAGE'},
        {label: this.rsrc('inputs.fireOn.options.OncePerVisit'), value: 'ONCE_PER_VISIT'},
        {label: this.rsrc('inputs.fireOn.options.OncePerVisitor'), value: 'ONCE_PER_VISITOR'},
        {label: this.rsrc('inputs.fireOn.options.EveryRequest'), value: 'EVERY_REQUEST'}
      ],
      placeholder: this.rsrc('inputs.fireOn.placeholder', 'Select One'),
      value: 'EVERY_PAGE',
    };
    this.initFormModel(fb);

    this.resources.get('api.sites.ruleengine.rules.inputs.action.type.placeholder').subscribe((label) => {
      this.actionTypePlaceholder = label;
    });

    this.resources.get('api.sites.ruleengine.rules.inputs.condition.type.placeholder').subscribe((label) => {
      this.conditionTypePlaceholder = label;
    });

  }

  initFormModel(fb: FormBuilder): void {
    let vFns = [];
    vFns.push(Validators.required);
    vFns.push(Validators.minLength(3));
    this.formModel = fb.group({
      name: new FormControl(this.rule ? this.rule.name : '', Validators.compose(vFns))
    });
  }

   rsrc(subkey: string, defVal = '-missing-'): any {

    let msgObserver = this._rsrcCache[subkey];
    if (!msgObserver) {
      msgObserver = this.resources.get(I8N_BASE + '.rules.' + subkey, defVal);
      this._rsrcCache[subkey] = msgObserver;
    }
    return msgObserver;
  }

  ngOnChanges(change): void {
    if (change.rule) {
      let rule = this.rule;
      let ctrl: FormControl = <FormControl> this.formModel.controls['name'];
      ctrl.patchValue(this.rule.name, {});

      ctrl.valueChanges.debounceTime(250).subscribe((name: string) => {
        if (ctrl.valid) {
          this.updateName.emit({payload: {rule: this.rule, value: name}, type: RULE_UPDATE_NAME});
        }
      });
      if (rule.isPersisted()) {
        this.fireOn.value = rule.fireOn;
      }
    }
  }

  statusText(length= 0): string {
    let t = '';
    if (this.saved) {
      t = 'All changes saved';
    } else if (this.saving) {
      t = 'Saving...';
    } else if (this.errors) {
      t = this.errors['invalid'] || this.errors['serverError'] || 'Unsaved changes...';
    }
    if (length) {
      t = t.substring(0, length) + '...';
    }
    return t;
  }

  setRuleExpandedState(expanded: boolean): void {
    this.updateExpandedState.emit({payload: {rule: this.rule, value: expanded}, type: V_RULE_UPDATE_EXPANDED_STATE});
  }

  setRuleEnabledState(enabled: boolean): void {
    this._updateEnabledStateDelay.emit({
      payload: {rule: this.rule, value: enabled},
      type: RULE_UPDATE_ENABLED_STATE
    });
  }

  onCreateRuleAction(): void {
    this.loggerService.info('RuleComponent', 'onCreateRuleAction');
    this.createRuleAction.emit( { payload: {rule: this.rule}, type: RULE_RULE_ACTION_CREATE} );
  }

  onDeleteCondition(event: ConditionActionEvent, conditionGroup: ConditionGroupModel): void {
    Object.assign(event.payload, { conditionGroup: conditionGroup, rule: this.rule });
    this.deleteCondition.emit( event );
  }

  onCreateConditionGroupClicked(): void {
    let len = this.rule._conditionGroups.length;
    let priority: number = len ? this.rule._conditionGroups[len - 1].priority : 1;
    this.createConditionGroup.emit({payload: {rule: this.rule, priority}, type: RULE_CONDITION_GROUP_CREATE});
  }

  onCreateCondition(event: ConditionActionEvent): void {
    this.loggerService.info('RuleComponent', 'onCreateCondition');
    Object.assign(event.payload, { rule: this.rule });
    this.createCondition.emit( event );
  }

  onUpdateRuleActionType(event: {type: string, payload: {value: string, index: number}}): void {
    this.loggerService.info('RuleComponent', 'onUpdateRuleActionType');
    this.updateRuleActionType.emit( { payload: Object.assign({rule: this.rule}, event.payload), type: RULE_RULE_ACTION_UPDATE_TYPE } );
  }

  onUpdateRuleActionParameter(event): void {
    this.loggerService.info('RuleComponent', 'onUpdateRuleActionParameter');
    this.updateRuleActionParameter.emit( { payload: Object.assign({rule: this.rule}, event.payload), type: RULE_RULE_ACTION_UPDATE_PARAMETER } );
  }

  onDeleteRuleAction(event: {type: string, payload: {value: string, index: number}}): void {
    this.loggerService.info('RuleComponent', 'onDeleteRuleAction');
    this.deleteRuleAction.emit( { payload: Object.assign({rule: this.rule}, event.payload), type: RULE_RULE_ACTION_DELETE } );
  }

  onUpdateConditionGroupOperator(event: {type: string, payload: {value: string, index: number}}, conditionGroup: ConditionGroupModel): void {
    this.updateConditionGroupOperator.emit( {
      payload: Object.assign({conditionGroup: conditionGroup, rule: this.rule}, event.payload),
      type: RULE_CONDITION_UPDATE_TYPE
    } );
  }

  onUpdateConditionType(event: {type: string, payload: {value: string, index: number}}, conditionGroup: ConditionGroupModel): void {
    this.loggerService.info('RuleComponent', 'onUpdateConditionType');
    this.updateConditionType.emit( {
      payload: Object.assign({conditionGroup: conditionGroup, rule: this.rule}, event.payload),
      type: RULE_CONDITION_UPDATE_TYPE
    } );
  }

  onUpdateConditionParameter(event, conditionGroup: ConditionGroupModel): void {
    this.loggerService.info('RuleComponent', 'onUpdateConditionParameter');
    this.updateConditionParameter.emit( {
      payload: Object.assign({conditionGroup: conditionGroup, rule: this.rule}, event.payload),
      type: RULE_CONDITION_UPDATE_PARAMETER
    } );
  }

  onUpdateConditionOperator(event, conditionGroup: ConditionGroupModel): void {
    this.loggerService.info('RuleComponent', 'onUpdateConditionOperator');
    this.updateConditionOperator.emit( {
      payload: Object.assign({conditionGroup: conditionGroup, rule: this.rule}, event.payload),
      type: RULE_CONDITION_UPDATE_OPERATOR
    } );
  }

  deleteRuleClicked(event: any): void {
    event.stopPropagation();
    let noWarn = this._user.suppressAlerts || (event.altKey && event.shiftKey);
    if (!noWarn) {
      noWarn = this.ruleActions.length === 1 && !this.ruleActions[0].isPersisted();
      noWarn = noWarn && this.rule._conditionGroups.length === 1;
      if (noWarn) {
        let conditions = this.rule._conditionGroups[0].conditions;
        let keys = Object.keys(conditions);
        noWarn = noWarn && (keys.length === 0);
      }
    }

    if (noWarn || confirm('Are you sure you want delete this rule?')) {
      this.deleteRule.emit({ payload: {rule: this.rule}, type: RULE_DELETE});
    }
  }
}

export {RuleComponent};
