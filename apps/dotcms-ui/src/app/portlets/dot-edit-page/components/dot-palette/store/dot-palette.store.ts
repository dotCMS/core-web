import { Injectable } from '@angular/core';
import { DotESContentService } from '@dotcms/app/api/services/dot-es-content/dot-es-content.service';
import { PaginatorService } from '@dotcms/app/api/services/paginator';
import { ESContent } from '@dotcms/app/shared/models/dot-es-content/dot-es-content.model';
import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
import { ComponentStore } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface DotPaletteState {
    contentlets: DotCMSContentlet[] | DotCMSContentType[];
    contentTypes: DotCMSContentType[];
    filter: string;
    languageId: string;
    totalRecords: number;
    viewContentlet: string;
    callState: CallState;
}

export const enum LoadingState {
    INIT = 'INIT',
    LOADING = 'LOADING',
    LOADED = 'LOADED'
}

export type CallState = LoadingState;

@Injectable()
export class DotPaletteStore extends ComponentStore<DotPaletteState> {
    constructor(
        public paginatorESService: DotESContentService,
        public paginationService: PaginatorService
    ) {
        super({
            contentlets: null,
            contentTypes: null,
            filter: '',
            languageId: '1',
            totalRecords: 0,
            viewContentlet: 'contentlet:out',
            callState: LoadingState.INIT
        });
    }

    /**
     * Request contentlets data with filter and pagination params.
     *
     * @param LazyLoadEvent [event]
     * @memberof DotPaletteStore
     */
    getContentletsData(event?: LazyLoadEvent): void {
        let filter: string;

        this.setLoading();

        this.filter$.pipe(take(1)).subscribe((value: string) => {
            filter = value;
        });

        if (this.isFormContentType) {
            this.paginationService.setExtraParams('filter', filter);

            this.paginationService
                .getWithOffset((event && event.first) || 0)
                .pipe(take(1))
                .subscribe((data: DotCMSContentlet[] | DotCMSContentType[]) => {
                    data.forEach((item) => (item.contentType = item.variable = 'FORM'));
                    this.setLoaded();
                    this.contentlets(data);
                    this.totalRecords(this.paginationService.totalRecords);
                });
        } else {
            let langId: string;
            this.languageId$.pipe(take(1)).subscribe((value: string) => {
                langId = value;
            });

            this.paginatorESService
                .get({
                    itemsPerPage: this.itemsPerPage,
                    lang: langId || '1',
                    filter: filter || '',
                    offset: (event && event.first.toString()) || '0',
                    query: `+contentType: ${this.contentTypeVarName}`
                })
                .pipe(take(1))
                .subscribe((response: ESContent) => {
                    this.setLoaded();
                    this.totalRecords(response.resultsSize);
                    this.contentlets(response.jsonObjectView.contentlets);
                });
        }
    }

    // SELECTORS
    private readonly contentlets$ = this.select(({ contentlets }) => {
        return contentlets;
    });

    private readonly contentTypes$ = this.select(({ contentTypes }) => {
        return contentTypes;
    });

    private readonly filter$ = this.select(({ filter }) => {
        return filter;
    });

    private readonly totalRecords$ = this.select(({ totalRecords }) => {
        return totalRecords;
    });

    private readonly languageId$ = this.select(({ languageId }) => {
        return languageId;
    });

    private readonly viewContentlet$ = this.select(({ viewContentlet }) => {
        return viewContentlet;
    });

    private readonly loading$: Observable<boolean> = this.select(
        (state) => state.callState === LoadingState.LOADING
    );

    private isFormContentType: boolean;
    private itemsPerPage = 25;
    private contentTypeVarName: string;

    readonly vm$ = this.select(
        this.contentlets$,
        this.contentTypes$,
        this.filter$,
        this.totalRecords$,
        this.viewContentlet$,
        this.loading$,
        (contentlets, contentTypes, filter, totalRecords, viewContentlet, loading) => ({
            contentlets,
            contentTypes,
            filter,
            totalRecords,
            viewContentlet,
            loading
        })
    );

    // UPDATERS
    private readonly contentlets = this.updater(
        (state: DotPaletteState, data: DotCMSContentlet[] | DotCMSContentType[]) => {
            return { ...state, contentlets: data };
        }
    );

    private readonly contentTypes = this.updater(
        (state: DotPaletteState, data: DotCMSContentType[]) => {
            return { ...state, contentTypes: data };
        }
    );

    private readonly totalRecords = this.updater((state: DotPaletteState, data: number) => {
        return { ...state, totalRecords: data };
    });

    readonly filter = this.updater((state: DotPaletteState, data: string) => {
        return { ...state, filter: data };
    });

    readonly languageId = this.updater((state: DotPaletteState, data: string) => {
        return { ...state, languageId: data };
    });

    readonly viewContentlet = this.updater((state: DotPaletteState, data: string) => {
        return { ...state, viewContentlet: data };
    });

    readonly setLoading = this.updater((state: DotPaletteState) => {
        return {
            ...state,
            callState: LoadingState.LOADING
        };
    });

    readonly setLoaded = this.updater((state: DotPaletteState) => {
        return {
            ...state,
            callState: LoadingState.LOADED
        };
    });

    // EFFECTS
    readonly loadContentTypes = this.effect((data$: Observable<DotCMSContentType[]>) => {
        return data$.pipe(
            map((data) => {
                this.contentTypes(data);
            })
        );
    });

    readonly filterContentlets = this.effect((filterValue$: Observable<string>) => {
        return filterValue$.pipe(
            map((value: string) => {
                this.filter(value);

                if (this.isFormContentType) {
                    this.paginationService.searchParam = 'variable';
                    this.paginationService.filter = value;
                }

                this.getContentletsData({ first: 0 });
            })
        );
    });

    readonly loadContentlets = this.effect((contentTypeVariable$: Observable<string>) => {
        return contentTypeVariable$.pipe(
            map((contentTypeVariable: string) => {
                this.contentTypeVarName = contentTypeVariable;
                this.isFormContentType = contentTypeVariable === 'forms';

                if (this.isFormContentType) {
                    this.paginationService.url = `v1/contenttype`;
                    this.paginationService.paginationPerPage = this.itemsPerPage;
                    this.paginationService.sortField = 'modDate';
                    this.paginationService.setExtraParams('type', 'Form');
                    this.paginationService.sortOrder = 1;
                }

                this.getContentletsData();
            })
        );
    });
}
