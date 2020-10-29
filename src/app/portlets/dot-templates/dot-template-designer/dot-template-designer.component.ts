import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    DotLayoutBody,
    DotLayoutColumn,
    DotLayoutRow
} from '@portlets/dot-edit-page/shared/models';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { MenuItem } from 'primeng/api';
import { zip } from 'rxjs';
import { pluck, take } from 'rxjs/operators';

@Component({
    selector: 'dot-dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss']
})
export class DotTemplateDesignerComponent implements OnInit {
    form: FormGroup;
    title: string;

    portletActions: {
        primary: MenuItem[];
        cancel: (event: MouseEvent) => void;
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private templateContainersCacheService: TemplateContainersCacheService,
        private dotTemplateService: DotTemplatesService
    ) {}

    ngOnInit(): void {
        this.portletActions = {
            primary: [
                {
                    label: 'Save',
                    command: (e) => {
                        console.log(e);
                        this.saveTemplate();
                    }
                }
            ],
            cancel: () => {
                console.log('cancel');
            }
        };

        const inode$ = this.activatedRoute.params.pipe(pluck('inode'));
        const data$ = this.activatedRoute.data.pipe(pluck('template'));

        zip(inode$, data$)
            .pipe(take(1))
            .subscribe(([inode, template]: [string, any]) => {
                this.templateContainersCacheService.set(template.containers);

                this.title = template.title;

                this.form = this.fb.group({
                    inode,
                    layout: this.fb.group({
                        body: this.cleanUpBody(template.layout.body) || {},
                        header: template.layout.header,
                        footer: template.layout.footer,
                        sidebar: { location: '', containers: [], width: 'small' }
                    })
                });
            });
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

    // this is dupe, need to extract
    private cleanUpBody(body: DotLayoutBody): DotLayoutBody {
        return body
            ? {
                  rows: body.rows.map((row: DotLayoutRow) => {
                      return {
                          ...row,
                          columns: row.columns.map((column: DotLayoutColumn) => {
                              return {
                                  containers: column.containers,
                                  leftOffset: column.leftOffset,
                                  width: column.width,
                                  styleClass: column.styleClass
                              };
                          })
                      };
                  })
              }
            : null;
    }
}
