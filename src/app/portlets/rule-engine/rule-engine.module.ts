import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AddToBundleDialogComponent } from 'dotcms-rules-engine/src/app/push-publish/add-to-bundle-dialog-component';
import { AddToBundleDialogContainer } from 'dotcms-rules-engine/src/app/push-publish/add-to-bundle-dialog-container';
import { AppRulesComponent } from 'dotcms-rules-engine/src/app/app.component';
import { AreaPickerDialogComponent } from 'dotcms-rules-engine/src/app/google-map/area-picker-dialog.component';
import { ConditionComponent } from 'dotcms-rules-engine/src/app/rule-condition-component';
import { ConditionGroupComponent } from 'dotcms-rules-engine/src/app/rule-condition-group-component';
import { Dropdown, InputOption } from 'dotcms-rules-engine/src/app/semantic/modules/dropdown/dropdown';
import { InputDate } from 'dotcms-rules-engine/src/app/semantic/elements/input-date/input-date';
import { InputText } from 'dotcms-rules-engine/src/app/semantic/elements/input-text/input-text';
import { InputToggle } from 'dotcms-rules-engine/src/app/input/toggle/InputToggle';
import { ModalDialogComponent } from 'dotcms-rules-engine/src/app/modal-dialog/dialog-component';
import { PushPublishDialogComponent } from 'dotcms-rules-engine/src/app/push-publish/push-publish-dialog-component';
import { PushPublishDialogContainer } from 'dotcms-rules-engine/src/app/push-publish/push-publish-dialog-container';
import { RestDropdown } from 'dotcms-rules-engine/src/app/semantic/modules/restdropdown/RestDropdown';
import { RuleActionComponent } from 'dotcms-rules-engine/src/app/rule-action-component';
import { RuleComponent } from 'dotcms-rules-engine/src/app/rule-component';
import { RuleEngineContainer, RuleEngineComponent } from 'dotcms-rules-engine/src/app';
import { ServersideCondition } from 'dotcms-rules-engine/src/app/condition-types/serverside-condition/serverside-condition';
import { VisitorsLocationComponent } from 'dotcms-rules-engine/src/app/custom-types/visitors-location/visitors-location.component';
import { VisitorsLocationContainer } from 'dotcms-rules-engine/src/app/custom-types/visitors-location/visitors-location.container';

import { ActionService } from 'dotcms-rules-engine/src/app/services/Action';
import { BundleService } from 'dotcms-rules-engine/src/app/services/bundle-service';
import { ConditionGroupService } from 'dotcms-rules-engine/src/app/services/ConditionGroup';
import { ConditionService } from 'dotcms-rules-engine/src/app/services/Condition';
import { GoogleMapService } from 'dotcms-rules-engine/src/app/services/GoogleMapService';
import { I18nService } from 'dotcms-rules-engine/src/app/services/system/locale/I18n';
import { Logger } from 'angular2-logger/core';
import { RuleService } from 'dotcms-rules-engine/src/app/services/Rule';

const routes: Routes = [
    {
        component: AppRulesComponent,
        path: ''
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AddToBundleDialogComponent,
        AddToBundleDialogContainer,
        AppRulesComponent, // Entry rule component
        AreaPickerDialogComponent,
        ConditionComponent,
        ConditionGroupComponent,
        Dropdown,
        InputDate,
        InputOption,
        InputText,
        InputToggle,
        ModalDialogComponent,
        PushPublishDialogComponent,
        PushPublishDialogContainer,
        RestDropdown,
        RuleActionComponent,
        RuleComponent,
        RuleEngineComponent,
        RuleEngineContainer,
        ServersideCondition,
        VisitorsLocationComponent,
        VisitorsLocationContainer
    ],
    providers: [
        ActionService,
        BundleService,
        ConditionGroupService,
        ConditionService,
        GoogleMapService,
        I18nService,
        Logger,
        RuleService
    ],
    exports: [AppRulesComponent]
})
export class RuleEngineModule {}

