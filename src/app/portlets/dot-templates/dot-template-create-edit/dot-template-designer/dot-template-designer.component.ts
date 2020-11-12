import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { DialogService } from 'primeng/dynamicdialog';

import { DotTemplatePropsComponent } from '../dot-template-props/dot-template-props.component';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DotTemplateStore } from '../store/dot-template.store';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';

@Component({
    selector: 'dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss'],
    providers: [DotTemplateStore]
})
export class DotTemplateDesignerComponent implements OnInit, OnDestroy {
    form: FormGroup;

    @Input()
    template: DotTemplate;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        private dialogService: DialogService,
        private store: DotTemplateStore,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {}

    ngOnInit(): void {
        const template = {
            identifier: this.template.identifier,
            title: this.template.title,
            friendlyName: this.template.friendlyName,
            layout: this.template.layout,
            containers: this.template.containers
        };

        this.templateContainersCacheService.set(this.template.containers);
        this.form = this.getForm(template);

        this.store.orginal$
            .pipe(takeUntil(this.destroy$), skip(1))
            .subscribe(({ identifier, title, friendlyName, layout, containers }: DotTemplate) => {
                /*
                    Don't change the order or this two lines because we need to populate the
                    containers cache before update the layout editor. Is bad but required a
                    bigger refactor to fix.
                */
                this.templateContainersCacheService.set(containers);
                this.form.setValue(
                    {
                        identifier,
                        title,
                        friendlyName,
                        layout,
                        containers
                    },
                    { emitEvent: false }
                );
            });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: DotTemplate) => {
            this.store.updateWorking(value);
        });

        this.store.setState({
            original: template,
            working: template
        });

        if (!this.template.identifier) {
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
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
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
}
