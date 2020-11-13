import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { DotPortletToolbarActions } from '@shared/models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, pluck, skip, takeUntil } from 'rxjs/operators';
import { DotTemplatePropsComponent } from './dot-template-props/dot-template-props.component';
import { DotTemplateStore } from './store/dot-template.store';

const EMPTY_TEMPLATE = {
    identifier: '',
    title: '',
    friendlyName: '',
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
    containers: {}
};

@Component({
    selector: 'dot-template-create-edit',
    templateUrl: './dot-template-create-edit.component.html',
    styleUrls: ['./dot-template-create-edit.component.scss'],
    providers: [DotTemplateStore]
})
export class DotTemplateCreateEditComponent implements OnInit, OnDestroy {
    isAdvaced$: Observable<boolean>;
    template$: Observable<Partial<DotTemplate>>;

    title$: Observable<string> = this.store.name$;
    actions$: Observable<DotPortletToolbarActions> = this.store.didTemplateChanged$.pipe(
        map((disabled: boolean) => this.getActions(disabled))
    );
    apiLink$: Observable<string> = this.store.identifier$.pipe(
        map((identifier: string) => `/api/v1/templates/${identifier}/working`)
    );

    identifier$: Observable<string> = this.store.identifier$;

    form: FormGroup;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private store: DotTemplateStore,
        private fb: FormBuilder,
        private dialogService: DialogService,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {}

    ngOnInit() {
        const type$ = this.activatedRoute.params.pipe(pluck('type'));

        this.template$ = this.activatedRoute.data.pipe(
            pluck('template'),
            map((template: DotTemplate) => template || EMPTY_TEMPLATE)
        );

        this.template$.pipe(takeUntil(this.destroy$)).subscribe((template: DotTemplate) => {
            this.store.setState({
                original: template,
                working: template
            });
            this.templateContainersCacheService.set(template.containers);
            this.form = this.getForm(template);

            if (!template.identifier) {
                this.createTemplate();
            }
        });

        this.isAdvaced$ = type$.pipe(
            map((type: string) => type === 'advanced'),
            mergeMap((isAdvanced: boolean) => {
                return this.template$.pipe(
                    pluck('drawed'),
                    map((isDrawed: boolean) => isDrawed === false || isAdvanced)
                );
            })
        );

        this.store.orginal$
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe(({ title, friendlyName, identifier, layout, containers }: DotTemplate) => {
                this.templateContainersCacheService.set(containers);
                this.form.setValue({ title, friendlyName, identifier, layout, containers });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Start template properties edition
     *
     * @memberof DotTemplateCreateEditComponent
     */
    editTemplateProps(): void {
        this.dialogService.open(DotTemplatePropsComponent, {
            header: 'Template Properties',
            width: '30rem',
            data: {
                template: this.form.value,
                onSave: (value: DotTemplate) => {
                    this.store.saveTemplate(value);
                }
            }
        });
    }

    /**
     * Save template to store
     *
     * @memberof DotTemplateCreateEditComponent
     */
    saveTemplate({ layout }: DotTemplate): void {
        this.store.saveTemplate({
            ...this.form.value,
            layout
        });
    }

    private createTemplate(): void {
        this.dialogService.open(DotTemplatePropsComponent, {
            header: 'Create new template',
            width: '30rem',
            closable: false,
            closeOnEscape: false,
            data: {
                template: this.form.value,
                onSave: (value: DotTemplate) => {
                    this.store.createTemplate(value);
                },
                onCancel: () => {
                    this.store.cancelCreate();
                }
            }
        });
    }

    private getForm({
        title,
        friendlyName,
        identifier,
        layout,
        body,
        containers,
        theme
    }: DotTemplate): FormGroup {
        return this.fb.group({
            title: [title, Validators.required],
            layout: layout ? this.fb.group(layout) : '',
            body,
            identifier,
            friendlyName,
            containers,
            theme
        });
    }

    private getActions(disabled = true): DotPortletToolbarActions {
        return {
            primary: [
                {
                    label: 'Save',
                    disabled: disabled,
                    command: () => {
                        this.store.saveTemplate(this.form.value);
                    }
                }
            ],
            cancel: () => {
                console.log('cancel');
            }
        };
    }
}
