import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { switchMap, tap } from 'rxjs/operators';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';

export interface DotTemplateStore {
    original: Partial<DotTemplate>;
    working: Partial<DotTemplate>;
}

@Injectable()
export class DotTemplateStore extends ComponentStore<Partial<DotTemplateStore>> {
    constructor(private dotTemplateService: DotTemplatesService) {
        super(null);
    }

    readonly name$: Observable<string> = this.select(
        ({ original }: DotTemplateStore) => original.title
    );

    readonly didTemplateChange$: Observable<
        boolean
    > = this.select(({ original, working }: DotTemplateStore) => _.isEqual(original, working));

    readonly updateWorking = this.updater(
        (state: DotTemplateStore, working: Partial<DotTemplate>) => ({
            ...state,
            working
        })
    );

    readonly saveTemplate = this.effect((origin$: Observable<Partial<DotTemplate>>) =>
        origin$.pipe(
            switchMap((template: Partial<DotTemplate>) => {
                const { containers, ...value } = template;
                return this.dotTemplateService.update(value as DotTemplate);
            }),
            tap((template: DotTemplate) => {
                this.setState({
                    original: template,
                    working: template
                });
            })
        )
    );
}
