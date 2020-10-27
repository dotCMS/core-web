import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    DotLayoutBody,
    DotLayoutColumn,
    DotLayoutRow
} from '@portlets/dot-edit-page/shared/models';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';
import { CONTAINER_SOURCE } from '@shared/models/container/dot-container.model';

const containers = {
    '//demo.dotcms.com/application/containers/default/': {
        container: {
            categoryId: 'f04b5078-1679-4965-bb12-446d3cb5948f',
            deleted: false,
            friendlyName: 'container',
            identifier: '69b3d24d-7e80-4be6-b04a-d352d16493ee',
            name: 'Default',
            type: 'containers',
            source: CONTAINER_SOURCE.FILE,
            parentPermissionable: {
                hostname: 'SYSTEM_HOST'
            }
        }
    }
};

@Component({
    selector: 'dot-dot-template-designer',
    templateUrl: './dot-template-designer.component.html',
    styleUrls: ['./dot-template-designer.component.scss']
})
export class DotTemplateDesignerComponent implements OnInit {
    form: FormGroup;

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {}

    ngOnInit(): void {
        this.templateContainersCacheService.set(containers);
        this.activatedRoute.data.subscribe((res) => {
            console.log(res.template.layout);

            this.form = this.fb.group({
                layout: this.fb.group({
                    body: this.cleanUpBody(res.template.layout.body) || {},
                    header: res.template.layout.header,
                    footer: res.template.layout.footer,
                    sidebar: {}
                })
            });
        });
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
