import { ComponentFixture } from '@angular/core/testing';
import { DotAutocompleteTagsComponent } from './dot-autocomplete-tags.component';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '@tests/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipsModule } from 'primeng/chips';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DotTagsService } from '@services/dot-tags/dot-tags.service';
import { Observable, of } from 'rxjs';
import { DotTag } from '@models/dot-tag';
import { By } from '@angular/platform-browser';

const mockResponse = [
    { label: 'test', siteId: '1', siteName: 'Site', persona: false },
    { label: 'united', siteId: '1', siteName: 'Site', persona: false }
];

class DotTagsServiceMock {
    getSuggestions(name?: string): Observable<DotTag[]> {
        return of(mockResponse);
    }
}

fdescribe('DotAutocompleteTagsComponent', () => {
    let component: DotAutocompleteTagsComponent;
    let fixture: ComponentFixture<DotAutocompleteTagsComponent>;
    let de: DebugElement;
    let autoComplete: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotAutocompleteTagsComponent],
            imports: [BrowserAnimationsModule, ChipsModule, AutoCompleteModule, FormsModule],
            providers: [{ provide: DotTagsService, useClass: DotTagsServiceMock }]
        });
        fixture = DOTTestBed.createComponent(DotAutocompleteTagsComponent);
        de = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
        autoComplete = de.query(By.css('p-autoComplete'));
    });

    it('should set options when load', () => {
        expect(component.filteredOptions).toEqual(mockResponse);
    });

    describe('autoComplete', () => {
        beforeEach(() => {
            component.placeholder = 'Custom Placeholder';
            fixture.detectChanges();
        });

        it('should set all properties correctly', () => {
            expect(autoComplete.componentInstance.field).toEqual('label');
            expect(autoComplete.componentInstance.dataKey).toEqual('label');
            expect(autoComplete.componentInstance.dropdown).toBe(true);
            expect(autoComplete.componentInstance.multiple).toBe(true);
            expect(autoComplete.componentInstance.placeholder).toEqual('Custom Placeholder');

        });

        describe('events', () => {
            beforeEach(() => {});


            describe('onKeyUp', () => {
                beforeEach(() => {});

                it('should call checkForTag', () => {

                });

                it('should add the tag if is unique and the user hit enter', () => {

                });

                it('should NOT add the tag because is duplicate if the user hit enter', () => {

                });
            });

            it('should call filterTags on completeMethod and remove already selected', () => {

            });

            it('should call addItem on onSelect event and ', () => {

            });
        });
    });

    it('', () => {});
});
