import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotPortletToolbarActions } from '@shared/models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, pluck, startWith, takeUntil } from 'rxjs/operators';
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
    selector: 'dot-dot-template-create-edit',
    templateUrl: './dot-template-create-edit.component.html',
    styleUrls: ['./dot-template-create-edit.component.scss'],
    providers: [DotTemplateStore]
})
export class DotTemplateCreateEditComponent implements OnInit, OnDestroy {
    isAdvaced$: Observable<boolean>;
    template$: Observable<DotTemplate>;

    title$: Observable<string> = this.store.name$;
    actions$: Observable<DotPortletToolbarActions> = this.store.didTemplateChanged$.pipe(
        map((disabled: boolean) => this.getActions(disabled))
    );
    apiLink$: Observable<string> = this.store.identifier$.pipe(
        map((identifier: string) => `/api/v1/templates/${identifier}/working`)
    );

    form: FormGroup;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private store: DotTemplateStore,
        private fb: FormBuilder,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        const type$ = this.activatedRoute.params.pipe(
            pluck('type'),
            filter((type: string) => !!type)
        );

        this.activatedRoute.data
            .pipe(
                pluck('template'),
                filter((template) => !!template),
                startWith(EMPTY_TEMPLATE),
                takeUntil(this.destroy$)
            )
            .subscribe((template) => {
                console.log('template', template);
                this.store.setState({
                    original: template,
                    working: template
                });
                this.form = this.getForm(template);
            });

        // this.template$ = this.activatedRoute.data.pipe(
        //     pluck('template'),
        //     filter((template) => !!template),
        //     startWith(EMPTY_TEMPLATE),
        //     tap((template) => {
        //         this.store.setState({
        //             original: template,
        //             working: template
        //         })
        //         this.form = this.getForm(template);
        //     })
        // );

        this.isAdvaced$ = type$.pipe(
            map((type: string) => type === 'advanced'),
            mergeMap((isAdvanced: boolean) => {
                return this.template$.pipe(
                    pluck('drawed'),
                    map((isDrawed: boolean) => isDrawed === false || isAdvanced)
                );
            })
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Start template properties edition
     *
     * @memberof DotTemplateDesignerComponent
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

    private getForm({
        title,
        friendlyName,
        identifier,
        layout,
        containers
    }: Partial<DotTemplate>): FormGroup {
        return this.fb.group({
            identifier,
            title: [title, Validators.required],
            friendlyName,
            containers,
            layout: this.fb.group(layout)
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
