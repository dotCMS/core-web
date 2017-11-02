import { ActionButtonComponent } from '../../../view/components/_common/action-button/action-button.component';
import { ActionHeaderComponent } from '../../../view/components/listing-data-table/action-header/action-header';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { DotContentletService } from '../../../api/services/dot-contentlet.service';
import { Observable } from 'rxjs/Observable';
import { ContentTypesPortletComponent } from './content-types.component';
import { CrudService } from '../../../api/services/crud';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { FormatDateService } from '../../../api/services/format-date-service';
import { ListingDataTableComponent } from '../../../view/components/listing-data-table/listing-data-table.component';
import { MessageService } from '../../../api/services/messages-service';
import { MockMessageService } from '../../../test/message-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Injectable } from '@angular/core';

@Injectable()
class MockDotContentletService {
    getContentTypes() {}
}

describe('ContentTypesPortletComponent', () => {
    let comp: ContentTypesPortletComponent;
    let fixture: ComponentFixture<ContentTypesPortletComponent>;
    let dotContentletService: DotContentletService;

    beforeEach(() => {
        let messageServiceMock = new MockMessageService({
            'contenttypes.form.label.description': 'Description',
            'contenttypes.fieldname.entries': 'Entries',
            'contenttypes.fieldname.structure.name': 'Content Type Name',
            'contenttypes.content.variable': 'Variable Name',
            mod_date: 'Last Edit Date'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                ActionHeaderComponent,
                ActionButtonComponent,
                ContentTypesPortletComponent,
                ListingDataTableComponent
            ],
            imports: [RouterTestingModule.withRoutes([{ path: 'test', component: ContentTypesPortletComponent }])],
            providers: [
                { provide: MessageService, useValue: messageServiceMock },
                CrudService,
                FormatDateService,
                ContentTypesInfoService,
                { provide: DotContentletService, useClass: MockDotContentletService }
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypesPortletComponent);
        comp = fixture.componentInstance;
        dotContentletService = fixture.debugElement.injector.get(DotContentletService);
        spyOn(dotContentletService, 'getContentTypes').and.returnValue(
            Observable.of([
                { name: 'CONTENT', label: 'Content', types: [] },
                { name: 'WIDGET', label: 'Widget', types: [] },
                { name: 'FORM', label: 'Form', types: [] }
            ])
        );
    });

    it('should display a listing-data-table.component', () => {
        comp.ngOnInit();

        let de = fixture.debugElement.query(By.css('listing-data-table'));

        expect('v1/contenttype').toEqual(de.nativeElement.getAttribute('url'));

        let columns = comp.contentTypeColumns;
        expect(5).toEqual(columns.length);

        expect('name').toEqual(columns[0].fieldName);
        expect('Content Type Name').toEqual(columns[0].header);

        expect('variable').toEqual(columns[1].fieldName);
        expect('Variable Name').toEqual(columns[1].header);

        expect('description').toEqual(columns[2].fieldName);
        expect('Description').toEqual(columns[2].header);

        expect('nEntries').toEqual(columns[3].fieldName);
        expect('Entries').toEqual(columns[3].header);
        expect('7%').toEqual(columns[3].width);

        expect('modDate').toEqual(columns[4].fieldName);
        expect('Last Edit Date').toEqual(columns[4].header);
        expect('13%').toEqual(columns[4].width);
    });

    it('should populate the actionHeaderOptions based on a call to dotContentletService', () => {
        comp.ngOnInit();
        expect(dotContentletService.getContentTypes).toHaveBeenCalled();
        expect(comp.actionHeaderOptions.primary.model.length).toEqual(3);
    });
});
