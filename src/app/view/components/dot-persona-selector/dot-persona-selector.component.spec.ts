import { ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { DotPersonaSelectorComponent } from './dot-persona-selector.component';
import { DebugElement, Component, Input } from '@angular/core';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotMessageService } from '@services/dot-messages-service';
import { By } from '@angular/platform-browser';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { mockDotPersona } from '@tests/dot-persona.mock';
import { DotPersonaSelectedItemModule } from '@components/dot-persona-selected-item/dot-persona-selected-item.module';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotPersonaSelectorOptionModule } from '@components/dot-persona-selector-option/dot-persona-selector-option.module';
import { of } from 'rxjs';
import { PaginatorService } from '@services/paginator';
import { DotAddPersonaDialogModule } from '@components/dot-add-persona-dialog/dot-add-persona-dialog.module';
import { IframeOverlayService } from '@components/_common/iframe/service/iframe-overlay.service';
import { LoginServiceMock } from '@tests/login-service.mock';
import { LoginService } from 'dotcms-js';
import { timeout } from 'rxjs/operators';

@Component({
    selector: 'dot-host-component',
    template: `
        <dot-persona-selector
                [disabled]="disabled"
                (selected)="selectedPersonaHandler($event)"
                (delete)="deletePersonaHandler($event)"
        ></dot-persona-selector>
    `
})
class HostTestComponent {
    @Input() disabled: boolean;
    selectedPersonaHandler(_$event) {}
    deletePersonaHandler(_$event) {}
}

class TestPaginatorService {
    filter: string;
    url: string;
    paginationPerPage: string;
    totalRecords = [mockDotPersona].length;

    getWithOffset(_offset: number) {
        return of([mockDotPersona]);
    }
}

fdescribe('DotPersonaSelectorComponent', () => {
    let component: DotPersonaSelectorComponent;
    let hostFixture: ComponentFixture<HostTestComponent>;
    let de: DebugElement;
    let paginatorService: PaginatorService;
    let dropdown: DebugElement;
    const defaultPersona: DotPersona = mockDotPersona;
    const messageServiceMock = new MockDotMessageService({
        'modes.persona.no.persona': 'Default Visitor',
        'modes.persona.personalized': 'Personalized'
    });

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DotPersonaSelectorComponent, HostTestComponent],
                imports: [
                    BrowserAnimationsModule,
                    SearchableDropDownModule,
                    DotPersonaSelectedItemModule,
                    DotPersonaSelectorOptionModule,
                    DotAddPersonaDialogModule
                ],
                providers: [
                    IframeOverlayService,
                    {
                        provide: DotMessageService,
                        useValue: messageServiceMock
                    },
                    { provide: PaginatorService, useClass: TestPaginatorService },
                    { provide: LoginService, useClass: LoginServiceMock }
                ]
            });
        })
    );

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(HostTestComponent);
        de = hostFixture.debugElement.query(By.css('dot-persona-selector'));
        component = de.componentInstance;
        paginatorService = hostFixture.debugElement.injector.get(PaginatorService);
        // hostFixture.componentInstance.pageId = mockDotPage.identifier;
        hostFixture.detectChanges();
        dropdown = de.query(By.css('dot-searchable-dropdown'));
    });

    it('should emit the selected persona', () => {
        spyOn(component.selected, 'emit');
        dropdown.triggerEventHandler('change', defaultPersona);
        expect(component.selected.emit).toHaveBeenCalledWith(defaultPersona);
    });

    it('should call filter change with keyword', () => {
        dropdown.triggerEventHandler('filterChange', 'test');
        expect(paginatorService.filter).toBe('test');
    });

    it('should call page change', () => {
        spyOn(paginatorService, 'getWithOffset').and.returnValue(of([mockDotPersona]));
        dropdown.triggerEventHandler('pageChange', { filter: '', first: 5, rows: 5 });
        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(5);
    });

    it('should set dot-searchable-dropdown with right attributes', () => {
        expect(dropdown.componentInstance.labelPropertyName).toBe('name');
        expect(dropdown.componentInstance.optionsWidth).toBe(448);
        expect(dropdown.componentInstance.rows).toBe(5);
        expect(dropdown.componentInstance.totalRecords).toBe(1);
        hostFixture.detectChanges();
        setTimeout(() => {
            expect(dropdown.componentInstance.data).toEqual([mockDotPersona]);
        }, 0);
    });

    it('should keep persona value when set by parent container', () => {
        // hostFixture.componentInstance.persona = mockDotPersona;
        hostFixture.detectChanges();
        expect(de.componentInstance.value).toEqual(mockDotPersona);
    });

    it('should call toggle when selected dot-persona-selected-item', () => {
        spyOn(dropdown.componentInstance, 'toggleOverlayPanel');
        hostFixture.whenStable().then(() => {
            hostFixture.detectChanges();
            const selectedItem = hostFixture.debugElement.query(
                By.css('dot-persona-selected-item')
            );
            selectedItem.triggerEventHandler('selected', {});
            expect(dropdown.componentInstance.toggleOverlayPanel).toHaveBeenCalled();
        });
    });

    it('should dot-persona-selector-option template with right params', () => {
        //   hostFixture.componentInstance.persona = { ...mockDotPersona };
        hostFixture.detectChanges();
        hostFixture.whenStable().then(() => {
            const personaSelector = hostFixture.debugElement.query(
                By.css('dot-persona-selected-item')
            );
            personaSelector.nativeElement.click();
            hostFixture.detectChanges();
            const mockPersonaData = { ...mockDotPersona, label: 'Global Investor' };
            const personaOption = hostFixture.debugElement.query(
                By.css('dot-persona-selector-option')
            );
            expect(personaOption.componentInstance.selected).toBe(true);
            expect(personaOption.componentInstance.persona).toEqual(mockPersonaData);
        });
    });

    it('should execute "change" event from dot-persona-selector-option', () => {
        // hostFixture.componentInstance.persona = { ...mockDotPersona };
        hostFixture.detectChanges();
        hostFixture.whenStable().then(() => {
            const personaSelector = hostFixture.debugElement.query(
                By.css('dot-persona-selected-item')
            );
            personaSelector.nativeElement.click();
            spyOn(component.selected, 'emit');
            spyOn(dropdown.componentInstance, 'toggleOverlayPanel');
            hostFixture.detectChanges();
            const personaOption = hostFixture.debugElement.query(
                By.css('dot-persona-selector-option')
            );
            personaOption.triggerEventHandler('change', defaultPersona);
            expect(component.selected.emit).toHaveBeenCalledWith(defaultPersona);
            expect(dropdown.componentInstance.toggleOverlayPanel).toHaveBeenCalled();
        });
    });

    it('should execute "delete" event from dot-persona-selector-option', () => {
        // hostFixture.componentInstance.persona = { ...mockDotPersona };
        hostFixture.detectChanges();
        hostFixture.whenStable().then(() => {
            const personaSelector = hostFixture.debugElement.query(
                By.css('dot-persona-selected-item')
            );
            personaSelector.nativeElement.click();
            spyOn(dropdown.componentInstance, 'toggleOverlayPanel');
            hostFixture.detectChanges();
            const personaOption = hostFixture.debugElement.query(
                By.css('dot-persona-selector-option')
            );
            personaOption.triggerEventHandler('delete', defaultPersona);
            expect(dropdown.componentInstance.toggleOverlayPanel).toHaveBeenCalled();
        });
    });
});
