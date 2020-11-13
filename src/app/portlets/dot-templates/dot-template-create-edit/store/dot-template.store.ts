import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, zip } from 'rxjs';
import * as _ from 'lodash';

import { DotLayout, DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { pluck, switchMap, take, tap } from 'rxjs/operators';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { ActivatedRoute } from '@angular/router';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { DotContainerMap } from '@shared/models/container/dot-container.model';

type DotTemplateType = 'design' | 'advanced';

interface DotTemplateItemDesign {
    type?: 'design';
    identifier: string;
    title: string;
    friendlyName: string;
    theme: string;
    layout: DotLayout;
    containers?: DotContainerMap;
}

interface DotTemplateItemadvanced {
    type?: 'advanced';
    identifier: string;
    title: string;
    friendlyName: string;
    body: string;
    drawed: boolean;
}

export type DotTemplateItem = DotTemplateItemDesign | DotTemplateItemadvanced;

export interface DotTemplateState {
    original: DotTemplateItem;
    working: DotTemplateItem;
    type: DotTemplateType;
}

const EMPTY_TEMPLATE = {
    identifier: '',
    title: '',
    friendlyName: ''
};

const EMPTY_TEMPLATE_DESIGN: DotTemplateItemDesign = {
    ...EMPTY_TEMPLATE,
    type: 'design',
    layout: {
        header: true,
        footer: true,
        body: {
            rows: []
        },
        sidebar: null,
        title: '',
        width: null
    },
    theme: '',
    containers: {}
};

const EMPTY_TEMPLATE_ADVANCED: DotTemplateItemadvanced = {
    ...EMPTY_TEMPLATE,
    type: 'advanced',
    body: '',
    drawed: false
};

@Injectable()
export class DotTemplateStore extends ComponentStore<DotTemplateState> {
    readonly template$ = this.select(({ original }: DotTemplateState) => {
        if (original.type === 'design') {
            delete original.containers;
        }

        return original;
    });

    readonly apiLink$: Observable<string> = this.select(
        ({ original: { identifier } }: DotTemplateState) =>
            `/api/v1/templates/${identifier}/working`
    );

    readonly didTemplateChanged$: Observable<
        boolean
    > = this.select(({ original, working }: DotTemplateState) => _.isEqual(original, working));

    readonly updateWorking = this.updater<DotTemplateItem>(
        (state: DotTemplateState, working: DotTemplateItem) => ({
            ...state,
            working
        })
    );

    readonly updateTemplate = this.updater<DotTemplate>(
        (state: DotTemplateState, template: DotTemplate) => {
            const type: DotTemplateType = template.drawed ? 'design' : 'advanced';

            if (type === 'design') {
                this.templateContainersCacheService.set(template.containers);
            }

            const item = this.getTemplateItem(template);

            return {
                ...state,
                working: item,
                original: item
            };
        }
    );

    readonly saveTemplate = this.effect((origin$: Observable<DotTemplateItem>) => {
        return origin$.pipe(
            switchMap((template: DotTemplateItem) => {
                delete template.type;

                if (template.type === 'design') {
                    delete template.containers;
                }
                return this.dotTemplateService.update(template as DotTemplate);
            }),
            tap((template: DotTemplate) => {
                this.updateTemplate(template);
            })
        );
    });

    readonly createTemplate = this.effect<DotTemplateItem>(
        (origin$: Observable<DotTemplateItem>) => {
            return origin$.pipe(
                switchMap((template: DotTemplateItem) => {
                    delete template.type;

                    if (template.type === 'design') {
                        delete template.containers;
                    }
                    return this.dotTemplateService.create(template as DotTemplate);
                }),
                tap(({ identifier }: DotTemplate) => {
                    this.dotRouterService.goToEditTemplate(identifier);
                })
            );
        }
    );

    constructor(
        private dotTemplateService: DotTemplatesService,
        private dotRouterService: DotRouterService,
        private activatedRoute: ActivatedRoute,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {
        super(null);

        const template$ = this.activatedRoute.data.pipe(pluck('template'));
        const type$ = this.activatedRoute.params.pipe(pluck('type'));

        zip(template$, type$)
            .pipe(take(1))
            .subscribe(([dotTemplate, type]: [DotTemplate, string]) => {
                const fixType = type as DotTemplateType;
                const isAdvanced = this.getIsAdvanced(fixType, dotTemplate?.drawed);

                const template = dotTemplate
                    ? this.getTemplateItem(dotTemplate)
                    : this.getDefaultTemplate(isAdvanced);

                if (template.type === 'design') {
                    this.templateContainersCacheService.set(template.containers);
                }

                this.setState({
                    original: template,
                    working: template,
                    type: fixType
                });
            });
    }

    cancelCreate = () => {
        this.dotRouterService.gotoPortlet('templates');
    };

    private getDefaultTemplate(isAdvanced: boolean): DotTemplateItem {
        return isAdvanced ? EMPTY_TEMPLATE_ADVANCED : EMPTY_TEMPLATE_DESIGN;
    }

    private getIsAdvanced(type: DotTemplateType, drawed: boolean): boolean {
        return type === 'advanced' || drawed === false;
    }

    private getTemplateItem(template: DotTemplate): DotTemplateItem {
        const { identifier, title, friendlyName } = template;

        let result: DotTemplateItem;

        if (template.drawed) {
            result = {
                type: 'design',
                identifier,
                title,
                friendlyName,
                layout: template.layout || EMPTY_TEMPLATE_DESIGN.layout,
                theme: template.theme,
                containers: template.containers
            };
        } else {
            result = {
                type: 'advanced',
                identifier,
                title,
                friendlyName,
                body: template.body,
                drawed: template.drawed
            };
        }

        return result;
    }
}
