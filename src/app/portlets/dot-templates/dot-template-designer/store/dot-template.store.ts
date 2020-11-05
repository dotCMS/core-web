import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotPortletToolbarActions } from '@shared/models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';

export interface DotTemplateStore {
    original: Partial<DotTemplate>;
    working: Partial<DotTemplate>;
}

@Injectable()
export class DotTemplateStore extends ComponentStore<Partial<DotTemplateStore>> {
    constructor() {
        super(null);
    }

    readonly name$: Observable<string> = this.select(
        ({ original }: DotTemplateStore) => original.name
    );

    readonly actions$: Observable<DotPortletToolbarActions> = this.select(
        ({ original, working }: DotTemplateStore) => {
            return this.getActions(_.isEqual(original.layout, working.layout));
        }
    );

    readonly updateWorking = this.updater(
        (state: DotTemplateStore, working: Partial<DotTemplate>) => ({
            ...state,
            working
        })
    );

    private getActions(disabled = true): DotPortletToolbarActions {
        console.log('disabled', disabled);
        return {
            primary: [
                {
                    label: 'Save',
                    disabled: disabled,
                    command: () => {
                        console.log('Save template');
                    }
                }
            ],
            cancel: () => {
                console.log('cancel');
            }
        };
    }
}
