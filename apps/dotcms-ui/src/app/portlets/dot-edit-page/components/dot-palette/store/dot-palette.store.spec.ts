import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { DotPaletteStore, LoadingState } from './dot-palette.store';
import { Injectable } from '@angular/core';
import { DotESContentService } from '@dotcms/app/api/services/dot-es-content/dot-es-content.service';
import { PaginatorService } from '@dotcms/app/api/services/paginator';
import { contentTypeDataMock } from '../dot-palette-content-type/dot-palette-content-type.component.spec';
import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
import {
    contentletFormDataMock,
    contentletProductDataMock
} from '../dot-palette-contentlets/dot-palette-contentlets.component.spec';

@Injectable()
class MockPaginatorService {
    url: string;
    paginationPerPage = 10;
    maxLinksPage = 5;
    sortField: string;
    sortOrder: string;
    totalRecords = 40;

    setExtraParams(): void {}

    public getWithOffset(): Observable<any[]> {
        return null;
    }
}

@Injectable()
class MockESPaginatorService {
    paginationPerPage = 15;
    totalRecords = 20;

    public get(): Observable<any[]> {
        return null;
    }
}

describe('DotPaletteStore', () => {
    let dotPaletteStore: DotPaletteStore;
    let paginatorService: PaginatorService;
    let dotESContentService: DotESContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DotPaletteStore,
                { provide: PaginatorService, useClass: MockPaginatorService },
                { provide: DotESContentService, useClass: MockESPaginatorService }
            ]
        });
        dotPaletteStore = TestBed.inject(DotPaletteStore);
        paginatorService = TestBed.inject(PaginatorService);
        dotESContentService = TestBed.inject(DotESContentService);
    });

    it('should update filter', () => {
        dotPaletteStore.filter('test');
        dotPaletteStore.state$.subscribe((data) => {
            expect(data.filter).toEqual('test');
        });
    });

    it('should update languageId', () => {
        dotPaletteStore.languageId('1');
        dotPaletteStore.state$.subscribe((data) => {
            expect(data.languageId).toEqual('1');
        });
    });

    it('should update viewContentlet', () => {
        dotPaletteStore.viewContentlet('in');
        dotPaletteStore.state$.subscribe((data) => {
            expect(data.viewContentlet).toEqual('in');
        });
    });

    it('should update setLoading', () => {
        dotPaletteStore.setLoading();
        dotPaletteStore.state$.subscribe((data) => {
            expect(data.callState).toEqual(LoadingState.LOADING);
        });
    });

    it('should update setLoaded', () => {
        dotPaletteStore.setLoaded();
        dotPaletteStore.state$.subscribe((data) => {
            expect(data.callState).toEqual(LoadingState.LOADED);
        });
    });

    it('should load contentTypes to store', (done) => {
        dotPaletteStore.loadContentTypes(contentTypeDataMock as DotCMSContentType[]);
        dotPaletteStore.vm$.subscribe((data) => {
            expect(data.contentTypes).toEqual(contentTypeDataMock as DotCMSContentType[]);
            done();
        });
    });

    it('should load Forms contentlets to store', (done) => {
        spyOn(paginatorService, 'getWithOffset').and.returnValue(of([contentletFormDataMock]));
        dotPaletteStore.loadContentlets('forms');

        expect(paginatorService.url).toBe('v1/contenttype');
        expect(paginatorService.paginationPerPage).toBe(25);
        expect(paginatorService.sortField).toBe('modDate');
        expect(paginatorService.sortOrder).toBe(1);

        dotPaletteStore.vm$.subscribe((data) => {
            expect(data.contentlets).toEqual([
                contentletFormDataMock
            ] as unknown as DotCMSContentType[]);
            expect(data.filter).toEqual('');
            expect(data.loading).toEqual(false);
            expect(data.totalRecords).toEqual(paginatorService.totalRecords);
            done();
        });
    });

    it('should load Product contentlets to store', (done) => {
        spyOn(dotESContentService, 'get').and.returnValue(
            <any>of({
                contentTook: 0,
                jsonObjectView: { contentlets: [contentletProductDataMock] },
                queryTook: 1,
                resultsSize: 20
            })
        );
        dotPaletteStore.loadContentlets('product');

        dotPaletteStore.vm$.subscribe((data) => {
            expect(dotESContentService.get).toHaveBeenCalledWith({
                itemsPerPage: 25,
                lang: '1',
                filter: '',
                offset: '0',
                query: '+contentType: product'
            });
            expect(data.contentlets).toEqual([
                contentletProductDataMock
            ] as unknown as DotCMSContentlet[]);
            expect(data.filter).toEqual('');
            expect(data.loading).toEqual(false);
            expect(data.totalRecords).toEqual(20);
            done();
        });
    });

    it('should set filter value in store', (done) => {
        spyOn(dotESContentService, 'get').and.returnValue(
            <any>of({
                contentTook: 0,
                jsonObjectView: { contentlets: [contentletProductDataMock] },
                queryTook: 1,
                resultsSize: 20
            })
        );
        dotPaletteStore.filterContentlets('Prod');
        dotPaletteStore.vm$.subscribe((data) => {
            expect(data.filter).toEqual('Prod');
            done();
        });
    });
});
