import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

import { ActionHeaderOptions } from '../../../shared/models/action-header';
import { BaseComponent } from '../../../view/components/_common/_base/base-component';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { DataTableColumn } from '../../../shared/models/data-table';
import { MessageService } from '../../../api/services/messages-service';
import { DotContentletService } from '../../../api/services/dot-contentlet.service';
import { StructureTypeView } from '../../../shared/models/contentlet';

/**
 * List of Content Types
 * use: listing-data-table.component
 * @export
 * @class ContentTypesPortletComponent
 * @extends {BaseComponent}
 */
@Component({
    selector: 'content-types',
    styleUrls: ['./content-types.component.scss'],
    templateUrl: 'content-types.component.html'
})
export class ContentTypesPortletComponent extends BaseComponent {
    public contentTypeColumns: DataTableColumn[];
    public item: any;
    public actionHeaderOptions: ActionHeaderOptions;

    constructor(
        messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private contentTypesInfoService: ContentTypesInfoService,
        private dotContentletService: DotContentletService
    ) {
        super(
            [
                'contenttypes.fieldname.structure.name',
                'contenttypes.content.variable',
                'contenttypes.form.label.description',
                'contenttypes.fieldname.entries',
                'message.structure.delete.structure.and.content',
                'message.structure.cantdelete',
                'contenttypes.content.fileasset',
                'contenttypes.content.content',
                'contenttypes.content.persona',
                'contenttypes.content.widget',
                'contenttypes.content.htmlpage',
                'contenttypes.content.key_value',
                'contenttypes.content.vanity_url',
                'contenttypes.content.form'
            ],
            messageService
        );
    }

    /**
     * Callback call from BaseComponent when the messages are received.
     * @memberOf ContentTypesPortletComponent
     */
    onMessage(): void {
        this.dotContentletService.getContentTypes().subscribe((res: StructureTypeView[]) => {
            this.actionHeaderOptions = {
                primary: {
                    command: $event => {
                        this.createContentType($event);
                    },
                    model: []
                }
            };
            res.filter(r => ['RECENT_CONTENT', 'RECENT_WIDGET'].indexOf(r.name) === -1).forEach(obj => {
                console.log(obj.name);
                this.actionHeaderOptions.primary.model.push({
                    command: $event => {
                        this.createContentType(obj.name.toLocaleLowerCase(), $event);
                    },
                    icon: this.contentTypesInfoService.getIcon(obj.name),
                    label: this.i18nMessages['contenttypes.content.' + obj.name.toLocaleLowerCase()]
                });
            });
        });

        this.contentTypeColumns = [
            {
                fieldName: 'name',
                header: this.i18nMessages['contenttypes.fieldname.structure.name'],
                icon: (item: any): string => this.contentTypesInfoService.getIcon(item.baseType),
                sortable: true
            },
            {
                fieldName: 'variable',
                header: this.i18nMessages['contenttypes.content.variable'],
                sortable: true
            },
            {
                fieldName: 'description',
                header: this.i18nMessages['contenttypes.form.label.description'],
                sortable: true
            },
            {
                fieldName: 'nEntries',
                header: this.i18nMessages['contenttypes.fieldname.entries'],
                width: '7%'
            },
            {
                fieldName: 'modDate',
                format: 'date',
                header: 'Last Edit Date',
                sortable: true,
                width: '13%'
            }
        ];
    }

    private createContentType(type: string, $event?): void {
        this.router.navigate(['create', type], { relativeTo: this.route });
    }

    private editContentType($event): void {
        this.router.navigate([`edit/${$event.data.id}`], {
            relativeTo: this.route
        });
    }
}
