import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotContentletService } from './dot-contentlet.service';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { mockDotContentlet } from '../../../test/dot-contentlet.mock';
import { StructureTypeView } from '../../../shared/models/contentlet/structure-type-view.model';

let lastConnection: any;
const MAIN_CONTENT_TYPES = ['CONTENT', 'WIDGET', 'FORM', 'FILEASSET', 'HTMLPAGE'];

function mockConnectionContentletResponse(): void {
    return lastConnection.mockRespond(
        new Response(
            new ResponseOptions({
                body: {
                    entity: mockDotContentlet
                }
            })
        )
    );
}

function isRecentContentType(type: StructureTypeView): boolean {
    return type.name.startsWith('RECENT');
}

function isMainContentType(type: StructureTypeView): boolean {
    return MAIN_CONTENT_TYPES.indexOf(type.name) > -1;
}

function isMoreContentType(type: StructureTypeView): boolean {
    return !isRecentContentType(type) && !isMainContentType(type);
}

describe('DotContentletService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotContentletService]);
        this.dotContentletService = this.injector.get(DotContentletService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (lastConnection = connection));
    });

    it('should call the BE with correct endpoint url and method for getContentTypes()', () => {
        this.dotContentletService.getContentTypes().subscribe((structures: StructureTypeView[]) => {
            expect(structures).toEqual(mockDotContentlet);
        });
        mockConnectionContentletResponse();
        expect(lastConnection.request.method).toBe(0); // 0 is GET method
        expect(lastConnection.request.url).toContain(`v1/contenttype/basetypes`);
    });

    it('should get the Main Content Types for getMainContentTypes()', () => {
        this.dotContentletService.getMainContentTypes().subscribe((structures: StructureTypeView[]) => {
            const types = mockDotContentlet.filter((structure: StructureTypeView) => isMainContentType(structure));
            expect(structures).toEqual(types);
        });
        mockConnectionContentletResponse();
    });

    it('should get all content types excluding the RECENT ones for getAllContentTypes()', () => {
        this.dotContentletService.getAllContentTypes().subscribe((structures: StructureTypeView[]) => {
            const types = mockDotContentlet.filter((structure: StructureTypeView) => !isRecentContentType(structure));
            expect(structures).toEqual(types);
        });
        mockConnectionContentletResponse();
    });

    it('should get extra content types for getMoreContentTypes()', () => {
        this.dotContentletService.getMoreContentTypes().subscribe((structures: StructureTypeView[]) => {
            const types = mockDotContentlet.filter((structure: StructureTypeView) => isMoreContentType(structure));
            expect(structures).toEqual(types);
        });
        mockConnectionContentletResponse();
    });

    it('should get the recent content types for getRecentContentTypes()', () => {
        this.dotContentletService.getRecentContentTypes().subscribe((structures: StructureTypeView[]) => {
            const types = mockDotContentlet.filter((structure: StructureTypeView) => isRecentContentType(structure));
            expect(structures).toEqual(types);
        });
        mockConnectionContentletResponse();
    });

    it('should get url by id for getUrlById()', () => {
        const idSearched = 'banner';
        this.dotContentletService.getUrlById(idSearched).subscribe((action: string) => {
            expect(action).toBe(mockDotContentlet[0].types[0].action);
        });
        mockConnectionContentletResponse();
    });
});
