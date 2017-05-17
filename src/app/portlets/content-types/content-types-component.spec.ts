import { DOTTestBed } from '../../api/util/test/dot-test-bed';
import { ContentTypesPortletComponent } from './content-types-component';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListingDataTableComponent } from '../../view/components/listing-data-table/listing-data-table-component';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { MessageService } from '../../api/services/messages-service';
import { MockMessageService } from '../../api/util/test/mock-message-service';
import { ListingService } from '../../api/services/listing-service';

describe('ContentTypesPortletComponent', () => {

    let comp:    ContentTypesPortletComponent;
    let fixture: ComponentFixture<ContentTypesPortletComponent>;

    beforeEach(() => {
        let messageServiceMock = new MockMessageService({
            'Description': 'Description',
            'Entries': 'Entries',
            'Structure-Name': 'Content Type Name',
            'Variable': 'Variable Name'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypesPortletComponent,
                ListingDataTableComponent
            ],
            imports: [ DataTableModule, SharedModule ],
            providers: [
                 {provide: MessageService, useValue: messageServiceMock},
                 ListingService
            ],
        });

        fixture = DOTTestBed.createComponent(ContentTypesPortletComponent);
        comp = fixture.componentInstance;
    });

    it('should display a listing-data-table-component', () => {
        let de = fixture.debugElement.query(By.css('listing-data-table-component'));
        console.log('de', de);
    });
});