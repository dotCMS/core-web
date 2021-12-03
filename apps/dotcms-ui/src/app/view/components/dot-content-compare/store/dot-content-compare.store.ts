import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DotCMSContentlet, DotCMSContentType, DotCMSContentTypeField } from '@dotcms/dotcms-models';
import { DotContentTypeService } from '@services/dot-content-type';
import { Observable } from 'rxjs';
import { DotContentCompareEvent } from '@components/dot-content-compare/dot-content-compare.component';
import { map, take } from 'rxjs/operators';

export interface DotContentCompareTable {}

export interface DotContentCompareState {
    working: string;
    compare: string;
    diff: {
        working: DotCMSContentlet;
        compare: DotCMSContentlet;
    };
    versions: DotCMSContentlet[];
    fields: DotCMSContentTypeField[];
    contentType: DotCMSContentType;
}

@Injectable()
export class DotContentCompareStore extends ComponentStore<DotContentCompareState> {
    constructor(private dotContentTypeService: DotContentTypeService) {
        super({
            working: null,
            compare: null,
            versions: [],
            fields: null,
            diff: null,
            contentType: null
        });
    }

    readonly vm$ = this.state$;

    private readonly versions$: Observable<DotCMSContentlet[]> = this.select(
        (state) => state.versions
    );
    private readonly working$: Observable<string> = this.select((state) => state.working);
    private readonly compare$: Observable<string> = this.select((state) => state.compare);

    // UPDATERS
    private readonly updateVersions = this.updater((state, versions: DotCMSContentlet[]) => {
        this.filterFields(state.contentType);
        return { ...state, versions };
    });

    private readonly updateContentType = this.updater((state, contentType: DotCMSContentType) => {
        return { ...state, contentType };
    });

    private readonly updateFields = this.updater((state, fields: DotCMSContentTypeField[]) => {
        return { ...state, fields };
    });

    private filterFields(contentType: DotCMSContentType): void {
        const fields = contentType.fields.filter((field) => field.dataType !== 'SYSTEM');
        this.updateFields(fields);
    }

    // //Effects
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
                                this.updateContentType(contentType);
                                this.updateVersions(contents);
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
