import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotPortletToolbarActions } from '@shared/models/dot-portlet-toolbar.model/dot-portlet-toolbar-actions.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { map, mergeAll, pluck, startWith, take } from 'rxjs/operators';
import { DotTemplatePropsComponent } from './dot-template-props/dot-template-props.component';

import * as _ from 'lodash';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotTemplateStore } from './store/dot-template.store';

@Component({
    selector: 'dot-dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss'],
    providers: [DotTemplateStore]
})
export class DotTemplateDesignerComponent implements OnInit {
    form: FormGroup;
    title$: Observable<string>;

    private originalData: DotTemplate;

    portletActions$: Observable<DotPortletToolbarActions>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private templateContainersCacheService: TemplateContainersCacheService,
        private dotTemplateService: DotTemplatesService,
        private dialogService: DialogService,
        private readonly store: DotTemplateStore
    ) {}

    ngOnInit(): void {
        this.title$ = this.store.name$;

        this.activatedRoute.data
            .pipe(pluck('template'), take(1))
            .subscribe((template: DotTemplate) => {
                this.store.setState(template);
            });

        this.portletActions$ = this.store.state$.pipe(
            take(1),
            map((template: DotTemplate) => {
                this.templateContainersCacheService.set(template.containers);
                this.form = this.getForm(template);
                this.originalData = { ...this.form.value };

                return this.form.valueChanges.pipe(
                    map((value: Partial<DotTemplate>) => {
                        return this.getToolbarActions(_.isEqual(value, this.originalData));
                    }),
                    startWith(this.getToolbarActions())
                );
            }),
            mergeAll()
        );
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
                    this.originalData = { ...this.form.value };
                }
            }
        });
    }

    private getForm(template: DotTemplate): FormGroup {
        const { title, friendlyName, identifier } = template;

        return this.fb.group({
            identifier,
            title,
            friendlyName,
            layout: this.fb.group({
                body: template.layout.body,
                header: template.layout.header,
                footer: template.layout.footer,
                sidebar: template.layout.sidebar
            })
        });
    }

    private getToolbarActions(disabled = true): DotPortletToolbarActions {
        return {
            primary: [
                {
                    label: 'Save',
                    disabled: disabled,
                    command: () => {
                        this.saveTemplate();
                    }
                }
            ],
            cancel: () => {
                console.log('cancel');
            }
        };
    }

    private saveTemplate(): void {
        this.dotTemplateService
            .update(this.form.value)
            .pipe(take(1))
            .subscribe(
                (res) => {
                    console.log(res);
                },
                (err) => {
                    console.log(err);
                }
            );
    }
}
