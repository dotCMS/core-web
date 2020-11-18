import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { DataTableColumn } from '@models/data-table';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotListingDataTableComponent } from '@components/dot-listing-data-table/dot-listing-data-table.component';
import { MenuItem } from 'primeng/api';
import { ActionHeaderOptions } from '@models/action-header';
import { DotActionMenuItem } from '@models/dot-action-menu/dot-action-menu-item.model';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotMessageSeverity, DotMessageType } from '@components/dot-message-display/model';
import { DotPushPublishDialogService } from 'dotcms-js';

@Component({
    selector: 'dot-template-list',
    templateUrl: './dot-template-list.component.html',
    styleUrls: ['./dot-template-list.component.scss']
})
export class DotTemplateListComponent implements OnInit, OnDestroy {
    @ViewChild('listing', { static: false })
    listing: DotListingDataTableComponent;
    tableColumns: DataTableColumn[];
    firstPage: DotTemplate[];
    templateBulkActions: MenuItem[];
    actionHeaderOptions: ActionHeaderOptions;
    addToBundleIdentifier: string;
    selectedTemplates: DotTemplate[] = [];

    private isEnterPrise: boolean;
    private hasEnvironments: boolean;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private dotMessageService: DotMessageService,
        private dotTemplatesService: DotTemplatesService,
        private dotMessageDisplayService: DotMessageDisplayService,
        private dotPushPublishDialogService: DotPushPublishDialogService
    ) {}

    ngOnInit(): void {
        this.route.data
            .pipe(pluck('dotTemplateListResolverData'), takeUntil(this.destroy$))
            .subscribe(([templates, isEnterPrise, hasEnvironments]) => {
                this.isEnterPrise = isEnterPrise;
                this.hasEnvironments = hasEnvironments;
                this.firstPage = templates;
                this.tableColumns = this.setTemplateColumns();
                this.templateBulkActions = this.setTemplateBulkActions();
            });
        this.setAddOptions();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle selected template.
     * @param {DotTemplate} template
     *
     * @memberof DotTemplateListComponent
     */
    editTemplate(template: DotTemplate): void {
        console.log(template);
    }

    /**
     * Handle filter for hide / show archive templates
     * @param {boolean} checked
     *
     * @memberof DotTemplateListComponent
     */
    handleArchivedFilter(checked: boolean): void {
        checked
            ? this.listing.paginatorService.setExtraParams('archive', checked)
            : this.listing.paginatorService.deleteExtraParams('archive');
        this.listing.loadFirstPage();
    }

    /**
     * Keep updated the selected templates in the grid
     * @param {DotTemplate[]} templates
     *
     * @memberof DotTemplateListComponent
     */
    updateSelectedTemplates(templates: DotTemplate[]): void {
        this.selectedTemplates = templates;
    }

    /**
     * Set the actions of each template based o current state.
     * @param {DotTemplate} template
     ** @returns DotActionMenuItem[]
     * @memberof DotTemplateListComponent
     */
    setTemplateActions(template: DotTemplate): DotActionMenuItem[] {
        let options: DotActionMenuItem[];
        if (template.deleted) {
            options = this.setArchiveTemplateActions(template);
        } else {
            options = [
                ...this.setBaseTemplateOptions(template),
                ...this.setLicenseAndRemotePublishTemplateOptions(template),
                ...this.setUnPublishAndArchiveTemplateOptions(template),
                ...this.setUnlockTemplateOptions(template),
                this.setCopyTemplateOptions(template)
            ];
        }
        return options;
    }

    private setTemplateColumns(): DataTableColumn[] {
        return [
            {
                fieldName: 'name',
                header: this.dotMessageService.get('templates.fieldName.name'),
                sortable: true
            },
            {
                fieldName: 'status',
                header: this.dotMessageService.get('templates.fieldName.status')
            },
            {
                fieldName: 'friendlyName',
                header: this.dotMessageService.get('templates.fieldName.description')
            },
            {
                fieldName: 'modDate',
                format: 'date',
                header: this.dotMessageService.get('templates.fieldName.lastEdit'),
                sortable: true
            }
        ];
    }

    private setAddOptions(): void {
        this.actionHeaderOptions = {
            primary: {
                model: [
                    {
                        command: () => {
                            console.log('TBD 1');
                        },
                        label: this.dotMessageService.get('design-template')
                    },
                    {
                        command: () => {
                            console.log('TBD 2 ');
                        },
                        label: this.dotMessageService.get('code-template')
                    }
                ]
            }
        };

    }

    private setTemplateBulkActions(): MenuItem[] {
        return [
            {
                label: this.dotMessageService.get('Publish'),
                command: () => {
                    this.publishTemplate(this.selectedTemplates.map(template => template.identifier));
                }
            },
            {
                label: this.dotMessageService.get('Remote-Publish'),
                command: () => {
                    this.dotPushPublishDialogService.open({
                        assetIdentifier: this.selectedTemplates
                            .map(template => template.identifier)
                            .toString(),
                        title: this.dotMessageService.get('contenttypes.content.push_publish')
                    });
                }
            },
            {
                label: this.dotMessageService.get('Add-To-Bundle'),
                command: () => {
                    this.addToBundleIdentifier = this.selectedTemplates
                        .map(template => template.identifier)
                        .toString();
                }
            },
            {
                label: this.dotMessageService.get('Unpublish'),
                command: () => {
                    this.unPublishTemplate(this.selectedTemplates.map(template => template.identifier));
                }
            },
            {
                label: this.dotMessageService.get('Archive'),
                command: () => {
                    this.archiveTemplates(this.selectedTemplates.map(template => template.identifier));
                }
            },
            {
                label: this.dotMessageService.get('Unarchive'),
                command: () => {
                    this.unArchiveTemplate(this.selectedTemplates.map(template => template.identifier));
                }
            },
            {
                label: this.dotMessageService.get('Delete'),
                command: () => {
                    this.deleteTemplate(this.selectedTemplates.map(template => template.identifier));
                }
            }
        ];
    }

    private setCopyTemplateOptions(template: DotTemplate): DotActionMenuItem {
        return {
            menuItem: {
                label: this.dotMessageService.get('Copy'),
                command: () => {
                    this.dotTemplatesService
                        .copy(template.identifier)
                        .pipe(take(1))
                        .subscribe(() => {
                            this.showToastNotification(
                                this.dotMessageService.get('message.template.copy')
                            );
                            this.listing.loadCurrentPage();
                        });
                }
            }
        };
    }

    private setUnlockTemplateOptions(template: DotTemplate): DotActionMenuItem[] {
        return template.locked
            ? [
                  {
                      menuItem: {
                          label: this.dotMessageService.get('unlock'),
                          command: () => {
                              this.dotTemplatesService
                                  .unlock(template.identifier)
                                  .pipe(take(1))
                                  .subscribe(() => {
                                      this.showToastNotification(
                                          this.dotMessageService.get('message.template.unlocked')
                                      );
                                      this.listing.loadCurrentPage();
                                  });
                          }
                      }
                  }
              ]
            : [];
    }

    private setUnPublishAndArchiveTemplateOptions(template: DotTemplate): DotActionMenuItem[] {
        const options: DotActionMenuItem[] = [];
        if (template.live) {
            options.push({
                menuItem: {
                    label: this.dotMessageService.get('Unpublish'),
                    command: () => {
                        this.unPublishTemplate([template.identifier]);
                    }
                }
            });
        } else {
            options.push({
                menuItem: {
                    label: this.dotMessageService.get('Archive'),
                    command: () => {
                        this.archiveTemplates([template.identifier]);
                    }
                }
            });
        }
        return options;
    }

    private setLicenseAndRemotePublishTemplateOptions(template: DotTemplate): DotActionMenuItem[] {
        const options: DotActionMenuItem[] = [];
        if (this.hasEnvironments) {
            options.push({
                menuItem: {
                    label: this.dotMessageService.get('Remote-Publish'),
                    command: () => {
                        this.dotPushPublishDialogService.open({
                            assetIdentifier: template.identifier,
                            title: this.dotMessageService.get('contenttypes.content.push_publish')
                        });
                    }
                }
            });
        }

        if (this.isEnterPrise) {
            options.push({
                menuItem: {
                    label: this.dotMessageService.get('Add-To-Bundle'),
                    command: () => {
                        this.addToBundleIdentifier = template.identifier;
                    }
                }
            });
        }
        return options;
    }

    private setBaseTemplateOptions(template: DotTemplate): DotActionMenuItem[] {
        return [
            {
                menuItem: {
                    label: this.dotMessageService.get('edit'),
                    command: () => {
                        // TODO: go to edit template
                    }
                }
            },
            {
                menuItem: {
                    label: this.dotMessageService.get('publish'),
                    command: () => {
                        this.publishTemplate([template.identifier]);
                    }
                }
            }
        ];
    }

    private setArchiveTemplateActions(template: DotTemplate): DotActionMenuItem[] {
        return [
            {
                menuItem: {
                    label: this.dotMessageService.get('Unarchive'),
                    command: () => {
                        this.unArchiveTemplate([template.identifier]);
                    }
                }
            },
            {
                menuItem: {
                    label: this.dotMessageService.get('Delete'),
                    command: () => {
                        this.deleteTemplate([template.identifier]);
                    }
                }
            }
        ];
    }

    private deleteTemplate(identifiers: string[]): void {
        if (confirm(this.dotMessageService.get('message.template.confirm.delete.template'))) {
            this.dotTemplatesService
                .delete(identifiers)
                .pipe(take(1))
                .subscribe(() => {
                    this.listing.loadCurrentPage();
                    this.showToastNotification(
                        this.dotMessageService.get('message.template.full_delete')
                    );
                });
        }
    }

    private publishTemplate(identifiers: string[]): void {
        this.dotTemplatesService
            .publish(identifiers)
            .pipe(take(1))
            .subscribe(() => {
                this.showToastNotification(
                    this.dotMessageService.get('message.template_list.published')
                );
                this.listing.loadCurrentPage();
            });
    }

    private unPublishTemplate(identifiers: string[]): void {
        this.dotTemplatesService
            .unPublish(identifiers)
            .pipe(take(1))
            .subscribe(() => {
                this.showToastNotification(
                    this.dotMessageService.get('message.template.unpublished')
                );
                this.listing.loadCurrentPage();
            });
    }

    private unArchiveTemplate(identifiers: string[]): void {
        this.dotTemplatesService
            .unArchive(identifiers)
            .pipe(take(1))
            .subscribe(() => {
                this.listing.loadCurrentPage();
                this.showToastNotification(this.dotMessageService.get('message.template.undelete'));
            });
    }

    private archiveTemplates(identifiers: string[]): void {
        this.dotTemplatesService
            .archive(identifiers)
            .pipe(take(1))
            .subscribe(() => {
                this.showToastNotification(
                    this.dotMessageService.get('message.template.delete')
                );
                this.listing.loadCurrentPage();
            });
    }

    private showToastNotification(message: string): void {
        this.dotMessageDisplayService.push({
            life: 3000,
            message: message,
            severity: DotMessageSeverity.SUCCESS,
            type: DotMessageType.SIMPLE_MESSAGE
        });
    }
}
