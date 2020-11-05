import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotPortletToolbarActions } from '@shared/models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { pluck, take, takeUntil } from 'rxjs/operators';
import { DotTemplatePropsComponent } from './dot-template-props/dot-template-props.component';

import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotTemplateStore } from './store/dot-template.store';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';

@Component({
    selector: 'dot-dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss'],
    providers: [DotTemplateStore]
})
export class DotTemplateDesignerComponent implements OnInit {
    form: FormGroup;
    title$: Observable<string>;
    actions$: Observable<DotPortletToolbarActions>;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        // private dotTemplateService: DotTemplatesService,
        private dialogService: DialogService,
        private readonly store: DotTemplateStore,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {}

    ngOnInit(): void {
        this.title$ = this.store.name$;
        this.actions$ = this.store.actions$;

        this.store.state$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                ({
                    original: { identifier, title, friendlyName, layout, containers }
                }: DotTemplateStore) => {
                    if (!this.form) {
                        this.form = this.getForm({
                            identifier,
                            title,
                            friendlyName,
                            layout
                        });
                    }
                    this.templateContainersCacheService.set(containers);
                }
            );

        this.activatedRoute.data
            .pipe(pluck('template'), take(1))
            .subscribe(({ identifier, title, friendlyName, layout, containers }: DotTemplate) => {
                const template = { identifier, title, friendlyName, layout, containers };

                this.store.setState({
                    original: template,
                    working: template
                });
            });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((template: DotTemplate) => {
            this.store.updateWorking(template);
        });
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
                doSomething: (value) => {
                    this.form.setValue(value);
                }
            }
        });
    }

    private getForm({ title, friendlyName, identifier, layout }: Partial<DotTemplate>): FormGroup {
        return this.fb.group({
            identifier,
            title,
            friendlyName,
            layout: this.fb.group(layout)
        });
    }

    // private saveTemplate(): void {
    //     this.dotTemplateService
    //         .update(this.form.value)
    //         .pipe(take(1))
    //         .subscribe(
    //             (res) => {
    //                 console.log(res);
    //             },
    //             (err) => {
    //                 console.log(err);
    //             }
    //         );
    // }
}
