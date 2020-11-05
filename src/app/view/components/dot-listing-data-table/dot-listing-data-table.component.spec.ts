import { of as observableOf, Observable } from 'rxjs';
import { DotAlertConfirmService } from '@services/dot-alert-confirm/dot-alert-confirm.service';
import { DotIconButtonTooltipModule } from '@components/_common/dot-icon-button-tooltip/dot-icon-button-tooltip.module';
import { DotActionMenuButtonComponent } from '../_common/dot-action-menu-button/dot-action-menu-button.component';
import { DotActionButtonComponent } from '../_common/dot-action-button/dot-action-button.component';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { TableModule } from 'primeng/table';
import { DebugElement, SimpleChange } from '@angular/core';
import { FormatDateService } from '@services/format-date-service';
import { DotListingDataTableComponent } from './dot-listing-data-table.component';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginatorService } from '@services/paginator';
import { ActionHeaderComponent } from './action-header/action-header.component';
import { DotActionMenuItem } from '@shared/models/dot-action-menu/dot-action-menu-item.model';
import { DotMenuModule } from '../_common/dot-menu/dot-menu.module';
import { DotIconModule } from '../_common/dot-icon/dot-icon.module';
import { DotIconButtonModule } from '../_common/dot-icon-button/dot-icon-button.module';
import { DotStringFormatPipe } from '@pipes/dot-string-format/dot-string-format.pipe';
import { SharedModule } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { LoggerService } from 'dotcms-js';

describe('DotListingDataTableComponent', () => {
    let comp: DotListingDataTableComponent;
    let fixture: ComponentFixture<DotListingDataTableComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let items;
    let paginatorService: PaginatorService;
    let columns;
    let url;

    beforeEach(() => {
        const messageServiceMock = new MockDotMessageService({
            'global-search': 'Global Serach'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                ActionHeaderComponent,
                DotActionButtonComponent,
                DotListingDataTableComponent,
                DotActionMenuButtonComponent
            ],
            imports: [
                TableModule,
                SharedModule,
                RouterTestingModule.withRoutes([
                    { path: 'test', component: DotListingDataTableComponent }
                ]),
                DotIconButtonTooltipModule,
                MenuModule,
                DotMenuModule,
                DotIconModule,
                DotIconButtonModule
            ],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: LoggerService, useValue: {} },
                { provide: PaginatorService, useValue: {} },
                FormatDateService,
                DotAlertConfirmService
            ]
        });

        fixture = DOTTestBed.createComponent(DotListingDataTableComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('p-table'));
        el = de.nativeElement;

        items = [
            {
                field1: 'item1-value1',
                field2: 'item1-value2',
                field3: 'item1-value3',
                nEntries: 'item1-value4',
                variable: 'Host'
            },
            {
                field1: 'item2-value1',
                field2: 'item2-value2',
                field3: 'item2-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            },
            {
                field1: 'item3-value1',
                field2: 'item3-value2',
                field3: 'item3-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            },
            {
                field1: 'item4-value1',
                field2: 'item4-value2',
                field3: 'item4-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            },
            {
                field1: 'item5-value1',
                field2: 'item5-value2',
                field3: 'item5-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            },
            {
                field1: 'item6-value1',
                field2: 'item6-value2',
                field3: 'item6-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            },
            {
                field1: 'item7-value1',
                field2: 'item7-value2',
                field3: 'item7-value3',
                nEntries: 'item1-value4',
                variable: 'Banner'
            }
        ];

        paginatorService = fixture.debugElement.injector.get(PaginatorService);
        paginatorService.paginationPerPage = 4;
        paginatorService.maxLinksPage = 2;
        paginatorService.totalRecords = items.length;

        columns = [
            { fieldName: 'field1', header: 'Field 1', width: '45%', sortable: true },
            { fieldName: 'field2', header: 'Field 2', width: '10%' },
            { fieldName: 'field3', header: 'Field 3', width: '30%' },
            { fieldName: 'nEntries', header: 'Field 4', width: '5%', textContent: 'View ({0})' }
        ];

        url = '/test/';
        comp.actions = [
            {
                menuItem: {
                    icon: 'fa fa-trash',
                    label: 'Remove',
                    command: () => {}
                }
            }
        ];
    });

    it('should set active element the global search on load', () => {
        const actionHeader = fixture.debugElement.query(By.css('dot-action-header'));
        const globalSearch = actionHeader.query(By.css('input'));

        comp.ngOnInit();

        expect(globalSearch.nativeElement).toBe(document.activeElement);
    });

    it('renderer basic datatable component', () => {
        spyOn(paginatorService, 'getWithOffset').and.callFake(() => {
            return Observable.create((observer) => {
                observer.next(Object.assign([], items));
            });
        });
        comp.columns = columns;
        comp.url = url;
        comp.multipleSelection = true;

        comp.ngOnChanges({
            columns: new SimpleChange(null, comp.columns, true),
            url: new SimpleChange(null, url, true)
        });

        fixture.detectChanges();
        const rows = el.querySelectorAll('tr');
        expect(8).toEqual(rows.length);

        const headers = rows[0].querySelectorAll('th');
        expect(5).toEqual(headers.length);

        comp.columns.forEach((_col, index) => {
            const sortableIcon = headers[index].querySelector('p-sortIcon');
            index === 0 ? expect(sortableIcon).toBeDefined() : expect(sortableIcon).toBeNull();
            expect(comp.columns[index].header).toEqual(headers[index].textContent.trim());
        });

        rows.forEach((row, rowIndex) => {
            if (rowIndex) {
                const cells = row.querySelectorAll('td');
                const item = items[rowIndex - 1];
                cells.forEach((_cell, cellIndex) => {
                    if (cellIndex < 3) {
                        expect(cells[cellIndex].querySelector('span').textContent).toContain(
                            item[comp.columns[cellIndex].fieldName]
                        );
                    }
                    if (cellIndex === 3) {
                        const anchor = cells[cellIndex].querySelector('a');
                        expect(anchor.textContent).toContain(
                            `View (${item[comp.columns[cellIndex].fieldName]})`
                        );
                        expect(anchor.href).toContain(
                            item.variable === 'Host' ? '/c/sites' : '/c/content?filter=Banner'
                        );
                    }
                });
            }
        });

        expect(url).toEqual(paginatorService.url);
    });

    it('renderer with format date column', () => {
        const dotStringFormatPipe = new DotStringFormatPipe();
        const itemsWithFormat = items.map((item) => {
            item.field3 = 1496178801000;
            return item;
        });

        spyOn(paginatorService, 'getWithOffset').and.callFake(() => {
            return Observable.create((observer) => {
                observer.next(Object.assign([], itemsWithFormat));
            });
        });

        columns[2].format = 'date';
        comp.columns = columns;
        comp.url = url;
        comp.multipleSelection = true;

        comp.ngOnChanges({
            columns: new SimpleChange(null, comp.columns, true),
            url: new SimpleChange(null, url, true)
        });

        fixture.detectChanges();

        const rows = el.querySelectorAll('tr');
        expect(8).toEqual(rows.length, 'tr');

        const headers = rows[0].querySelectorAll('th');
        expect(5).toEqual(headers.length, 'th');

        comp.columns.forEach((_col, index) =>
            expect(comp.columns[index].header).toEqual(headers[index].textContent.trim())
        );

        rows.forEach((row, rowIndex) => {
            if (rowIndex) {
                const cells = row.querySelectorAll('td');
                const item = items[rowIndex - 1];

                cells.forEach((_cell, cellIndex) => {
                    if (cellIndex < 4) {
                        const textContent = cells[cellIndex].textContent;
                        const itemContent = comp.columns[cellIndex].textContent
                            ? dotStringFormatPipe.transform(comp.columns[cellIndex].textContent, [
                                  item[comp.columns[cellIndex].fieldName]
                              ])
                            : item[comp.columns[cellIndex].fieldName];
                        expect(textContent).toContain(itemContent);
                    }
                });
            }
        });

        expect(url).toEqual(paginatorService.url);
    });

    it('should renderer table without checkbox', () => {
        spyOn(paginatorService, 'getWithOffset').and.callFake(() => {
            return Observable.create((observer) => {
                observer.next(Object.assign([], items));
            });
        });

        comp.columns = columns;
        comp.url = url;

        comp.ngOnChanges({
            columns: new SimpleChange(null, comp.columns, true),
            url: new SimpleChange(null, url, true)
        });

        const dataList = fixture.debugElement.query(By.css('p-table'));
        const dataListComponentInstance = dataList.componentInstance;

        dataListComponentInstance.onLazyLoad.emit({
            first: 0
        });

        fixture.detectChanges();

        const rows = el.querySelectorAll('tr');
        expect(8).toEqual(rows.length);

        const headers = rows[0].querySelectorAll('th');
        expect(5).toEqual(headers.length);
    });

    it('should add a column if actions are received', () => {
        const fakeActions: DotActionMenuItem[] = [
            {
                menuItem: {
                    icon: 'fa fa-trash',
                    label: 'Remove',
                    command: () => {}
                }
            }
        ];
        spyOn(paginatorService, 'getWithOffset').and.callFake(() => {
            return Observable.create((observer) => {
                observer.next(Object.assign([], items));
            });
        });

        comp.columns = columns;

        comp.ngOnChanges({
            columns: new SimpleChange(null, comp.columns, true)
        });

        fixture.detectChanges();

        const rows = el.querySelectorAll('tr');
        expect(rows[0].cells.length).toEqual(5);

        comp.actions = fakeActions;
        fixture.detectChanges();

        expect(rows[0].cells.length).toEqual(5);
    });

    it('should receive an action an execute the command after clickling over the action button', () => {
        const fakeActions: DotActionMenuItem[] = [
            {
                menuItem: {
                    icon: 'fa fa-trash',
                    label: 'Remove',
                    command: () => {}
                }
            }
        ];
        spyOn(paginatorService, 'getWithOffset').and.callFake(() => {
            return Observable.create((observer) => {
                observer.next(Object.assign([], items));
            });
        });

        comp.columns = columns;
        comp.actions = fakeActions;

        comp.ngOnChanges({
            columns: new SimpleChange(null, comp.columns, true)
        });

        fixture.detectChanges();
        const actionButton = de.query(By.css('dot-action-menu-button'));

        const spy = spyOn(fakeActions[0].menuItem, 'command');

        actionButton.nativeElement.children[0].click();

        expect(spy).toHaveBeenCalled();
    });

    it('should show the loading indicator while the data is received', () => {
        expect(comp.loading).toEqual(true);
        spyOn(paginatorService, 'getCurrentPage').and.returnValue(observableOf(items));
        comp.columns = columns;
        comp.loadCurrentPage();
        expect(comp.loading).toEqual(false);
    });

    it('should load first page of resutls and set pagination to 1', () => {
        comp.dataTable.first = 3;
        spyOn(paginatorService, 'get').and.returnValue(observableOf(items));

        comp.loadFirstPage();

        expect(comp.dataTable.first).toBe(1);
        expect(comp.items.length).toBe(7);
    });

    xit('should focus first row on arrowDown in Global Search Input', () => {
        spyOn(comp, 'focusFirstRow').and.callThrough();
        spyOn(paginatorService, 'get').and.returnValue(observableOf(items));
        comp.columns = columns;
        comp.loadFirstPage();
        fixture.detectChanges();
        comp.globalSearch.nativeElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'arrowDown' })
        );

        expect(comp.dataTable.tableViewChild.nativeElement.rows[1]).toBe(document.activeElement);
    });

    it('should set the pagination size in the Table', () => {
        spyOn(paginatorService, 'get').and.returnValue(observableOf(items));
        comp.paginationPerPage = 5;
        comp.columns = columns;
        comp.loadFirstPage();
        fixture.detectChanges();

        expect(comp.dataTable.rows).toBe(5);
    });
});
