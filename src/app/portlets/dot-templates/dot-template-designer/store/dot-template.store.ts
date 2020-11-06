import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { switchMap, tap } from 'rxjs/operators';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';

export interface DotTemplateState {
    original: Partial<DotTemplate>;
    working: Partial<DotTemplate>;
}

@Injectable()
export class DotTemplateStore extends ComponentStore<DotTemplateState> {
    constructor(private dotTemplateService: DotTemplatesService) {
        super(null);
    }

    readonly name$: Observable<string> = this.select(
        ({ original }: DotTemplateState) => original.title
    );

    readonly didTemplateChange$: Observable<
        boolean
    > = this.select(({ original, working }: DotTemplateState) => _.isEqual(original, working));

    readonly updateWorking = this.updater<DotTemplate>(
        (state: DotTemplateState, working: Partial<DotTemplate>) => ({
            ...state,
            working
        })
    );

    readonly saveTemplate = this.effect((origin$: Observable<Partial<DotTemplate>>) => {
        return origin$.pipe(
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
        );
    });
}
