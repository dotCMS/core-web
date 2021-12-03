import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DotCMSContentlet, DotCMSContentType, DotCMSContentTypeField } from '@dotcms/dotcms-models';
import { DotContentTypeService } from '@services/dot-content-type';
import { Observable } from 'rxjs';
import { DotContentCompareEvent } from '@components/dot-content-compare/dot-content-compare.component';
import { map, take } from 'rxjs/operators';

export interface DotContentCompareTable {}

export interface DotContentCompareState {
    working: DotCMSContentlet;
    compare: DotCMSContentlet;
    versions: DotCMSContentlet[];
    fields: DotCMSContentTypeField[];
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
    constructor(private dotContentTypeService: DotContentTypeService) {
        super({
            working: null,
            compare: null,
            versions: [],
            fields: null
        });
    }

    readonly vm$ = this.state$;

    private readonly versions$: Observable<DotCMSContentlet[]> = this.select(
        (state) => state.versions
    );
    private readonly working$: Observable<DotCMSContentlet> = this.select((state) => state.working);
    private readonly compare$: Observable<DotCMSContentlet> = this.select((state) => state.compare);

    // UPDATERS
    private readonly updateVersions = this.updater((state, versions: DotCMSContentlet[]) => {
        return { ...state, versions };
    });

    private readonly updateWorking = this.updater((state, working: DotCMSContentlet) => {
        return { ...state, working };
    });

    private readonly updateCompare = this.updater((state, compare: DotCMSContentlet) => {
        return { ...state, compare };
    });

    private readonly updateFields = this.updater((state, fields: DotCMSContentTypeField[]) => {
        return { ...state, fields };
    });

    private filterFields(contentType: DotCMSContentType): void {
        const fields = contentType.fields.filter(
            (field) => FieldWhiteList[field.fieldType] != undefined
        );
        this.updateFields(fields);
    }

    private assignCompareVersions(
        data: DotContentCompareEvent,
        contents: DotCMSContentlet[]
    ): void {
        this.updateCompare(contents.find((content) => content.inode === data.inode));
        this.updateWorking(contents.find((content) => content.working === true));
    }

    private mapFieldValues(): void {}

    //Effects

    readonly loadData = this.effect((data$: Observable<DotContentCompareEvent>) => {
        return data$.pipe(
            map((data) => {
                this.dotContentTypeService
                    .getContentTypeHistory(data.identifier, data.language)
                    .pipe(take(1))
                    .subscribe((contents) => {
                        this.dotContentTypeService
                            .getContentType(contents[0].contentType)
                            .pipe(take(1))
                            .subscribe((contentType: DotCMSContentType) => {
                                this.updateVersions(contents);
                                this.filterFields(contentType);
                                this.assignCompareVersions(data, contents);
                            });
                    });
            })
        );
    });

    // readonly updateDialog = this.effect((data: Observable<any>) => {
    //     return this.dotContentCompareDialogService.showDialog$.pipe(
    //         map((data) => {
    //             this.showDialog();
    //         })
    //     );
    // });

    // readonly getContentTypeVersions = this.effect((id$: Observable<string>) => {
    //     return id$.pipe(
    //         map((id: string) => {
    //             return dotContentTypeService.getContentTypeHistory(id);
    //         })
    //     );
    // });
}
