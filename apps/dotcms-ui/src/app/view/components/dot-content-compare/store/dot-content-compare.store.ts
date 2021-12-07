import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DotCMSContentlet, DotCMSContentType, DotCMSContentTypeField } from '@dotcms/dotcms-models';
import { DotContentTypeService } from '@services/dot-content-type';
import { Observable } from 'rxjs';
import { DotContentCompareEvent } from '@components/dot-content-compare/dot-content-compare.component';
import { map, take } from 'rxjs/operators';
import { DotContentletService } from '@services/dot-contentlet/dot-contentlet.service';

export interface DotContentCompareTableData {
    working: DotCMSContentlet;
    compare: DotCMSContentlet;
    versions: DotCMSContentlet[];
    fields: DotCMSContentTypeField[];
}

export interface DotContentCompareState {
    data: DotContentCompareTableData;
    showDiff: boolean;
}

export enum FieldWhiteList {
    Text = 'Text',
    Textarea = 'Textarea',
    Checkbox = 'Checkbox',
    'Constant-Field' = 'Constant-Field',
    'Key-Value' = 'Key-Value',
    Radio = 'Radio',
    Select = 'Select',
    'Multi-Select' = 'Multi-Select',
    Tag = 'Tag',
    'Custom-Field' = 'Custom-Field',
    'Hidden-Field' = 'Hidden-Field',
    Image = 'image',
    File = 'File',
    Binary = 'Binary',
    Category = 'Category',
    Date = 'Date',
    'Date-and-Time' = 'Date-and-Time',
    Time = 'Time',
    'WYSIWYG' = 'WYSIWYG',
    'Host-Folder' = 'Host-Folder'
}

@Injectable()
export class DotContentCompareStore extends ComponentStore<DotContentCompareState> {
    constructor(
        private dotContentTypeService: DotContentTypeService,
        private dotContentletService: DotContentletService
    ) {
        super({
            data: null,
            showDiff: true
        });
    }

    readonly vm$ = this.state$;

    // UPDATERS
    private readonly updateData = this.updater((state, data: DotContentCompareTableData) => {
        return { ...state, data };
    });

    readonly updateCompare = this.updater((state, compare: DotCMSContentlet) => {
        return { ...state, data: { ...state.data, compare } };
    });

    readonly updateShowDiff = this.updater((state, showDiff: boolean) => {
        return { ...state, showDiff };
    });

    private filterFields(contentType: DotCMSContentType): DotCMSContentTypeField[] {
        return contentType.fields.filter((field) => FieldWhiteList[field.fieldType] != undefined);
    }

    private getCompareVersion(inode: string, contents: DotCMSContentlet[]): DotCMSContentlet {
        return contents.find((content) => content.inode === inode);
    }

    private getWorkingVersion(contents: DotCMSContentlet[]): DotCMSContentlet {
        return contents.find((content) => content.working === true);
    }

    //Effects

    readonly loadData = this.effect((data$: Observable<DotContentCompareEvent>) => {
        return data$.pipe(
            map((data) => {
                this.dotContentletService
                    .getContentTypeHistory(data.identifier, data.language)
                    .pipe(take(1))
                    .subscribe((contents) => {
                        this.dotContentTypeService
                            .getContentType(contents[0].contentType)
                            .pipe(take(1))
                            .subscribe((contentType: DotCMSContentType) => {
                                this.updateData({
                                    working: this.getWorkingVersion(contents),
                                    compare: this.getCompareVersion(data.inode, contents),
                                    versions: contents.filter(
                                        (content) => content.working === false
                                    ),
                                    fields: this.filterFields(contentType)
                                });
                            });
                    });
            })
        );
    });
}
