import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { switchMap, tap } from 'rxjs/operators';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';

export interface DotTemplateState {
    original: Partial<DotTemplate>;
    working: Partial<DotTemplate>;
}

@Injectable()
export class DotTemplateStore extends ComponentStore<DotTemplateState> {
    readonly name$: Observable<string> = this.select(
        ({ original }: DotTemplateState) => original.title
    );

    readonly identifier$: Observable<string> = this.select(
        ({ original }: DotTemplateState) => original.identifier
    );

    readonly orginal$: Observable<Partial<DotTemplate>> = this.select(
        ({ original }: DotTemplateState) => original
    );

    readonly didTemplateChanged$: Observable<
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

    readonly createTemplate = this.effect((origin$: Observable<Partial<DotTemplate>>) => {
        return origin$.pipe(
            switchMap((template: Partial<DotTemplate>) => {
                const { containers, ...value } = template;
                return this.dotTemplateService.create(value as DotTemplate);
            }),
            tap(({ identifier }: DotTemplate) => {
                this.dotRouterService.goToEditTemplate(identifier);
            })
        );
    });

    constructor(
        private dotTemplateService: DotTemplatesService,
        private dotRouterService: DotRouterService
    ) {
        super(null);
    }

    readonly cancelCreate = () => {
        this.dotRouterService.gotoPortlet('templates');
    };
}
